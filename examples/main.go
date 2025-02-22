package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/PuerkitoBio/goquery"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ScrapeResult struct {
	URL         string            `json:"url" bson:"url"`
	Title       string            `json:"title" bson:"title"`
	Price       string            `json:"price" bson:"price"`
	Brand       string            `json:"brand" bson:"brand"`
	Description string            `json:"description" bson:"description"`
	Features    map[string]string `json:"features" bson:"features"`
}

func scrape(url string) ScrapeResult {
	// Create a new HTTP request
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Printf("Error creating request for URL %s: %v\n", url, err)
		return ScrapeResult{URL: url, Title: "Failed to create request", Price: "N/A", Brand: "N/A", Description: "N/A", Features: nil}
	}

	// Set headers to mimic a browser
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
	req.Header.Set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8")
	req.Header.Set("Accept-Language", "en-US,en;q=0.9")

	// Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error fetching URL %s: %v\n", url, err)
		return ScrapeResult{URL: url, Title: "Failed to fetch", Price: "N/A", Brand: "N/A", Description: "N/A", Features: nil}
	}
	defer resp.Body.Close()

	// Parse the HTML document
	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		log.Printf("Error parsing HTML for URL %s: %v\n", url, err)
		return ScrapeResult{URL: url, Title: "Failed to parse", Price: "N/A", Brand: "N/A", Description: "N/A", Features: nil}
	}

	title := strings.TrimSpace(doc.Find("span#productTitle").Text())
	if title == "" {
		title = "Title not found"
	}

	// Extract product price
	price := doc.Find("span.a-price span.a-offscreen").First().Text()
	if price == "" {
		price = "Price not found"
	}

	// Extract brand name
	brand := doc.Find("a#bylineInfo").Text()
	if brand == "" {
		brand = "Brand not found"
	}

	// Extract product description (bullet points)
	var descriptionBuilder strings.Builder
	doc.Find("div#feature-bullets ul.a-unordered-list li").Each(func(i int, s *goquery.Selection) {
		text := strings.TrimSpace(s.Text())
		if text != "" {
			descriptionBuilder.WriteString(text)
			descriptionBuilder.WriteString(" ")
		}
	})
	description := strings.TrimSpace(descriptionBuilder.String())
	if description == "" {
		description = "Description not found"
	}

	// Extract features (example: key-value pairs from a table)
	features := make(map[string]string)
	doc.Find("table.prodDetTable tr").Each(func(i int, s *goquery.Selection) {
		key := s.Find("th").Text()
		value := s.Find("td").Text()
		if key != "" && value != "" {
			features[key] = strings.TrimSpace(value)
		}
	})

	return ScrapeResult{
		URL:         url,
		Title:       title,
		Price:       price,
		Brand:       brand,
		Description: description,
		Features:    features,
	}
}

func connectToMongoDB(uri string) (*mongo.Client, error) {
	clientOptions := options.Client().ApplyURI(uri)
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		return nil, err
	}
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		return nil, err
	}
	fmt.Println("Connected to MongoDB!")
	return client, nil
}

func saveToMongoDB(client *mongo.Client, databaseName, collectionName string, data ScrapeResult) error {
	collection := client.Database(databaseName).Collection(collectionName)
	_, err := collection.InsertOne(context.TODO(), data)
	if err != nil {
		return err
	}
	fmt.Printf("Inserted document for URL: %s\n", data.URL)
	return nil
}

func main() {
	// Get URLs from environment variable
	urls := os.Getenv("URLS")
	if urls == "" {
		log.Fatal("No URLs provided!")
	}

	// Parse URLs from JSON string
	urlList := []string{}
	err := json.Unmarshal([]byte(urls), &urlList)
	if err != nil {
		log.Fatalf("Error parsing URLs: %v\n", err)
	}

	// Connect to MongoDB
	mongoURI := os.Getenv("MONGO_URI") // Set this in your environment
	if mongoURI == "" {
		log.Fatal("MONGO_URI environment variable not set!")
	}
	client, err := connectToMongoDB(mongoURI)
	if err != nil {
		log.Fatalf("Error connecting to MongoDB: %v\n", err)
	}
	defer client.Disconnect(context.TODO())

	// Scrape each URL and save to MongoDB
	for _, url := range urlList {
		result := scrape(url)

		// Save the result to MongoDB
		err := saveToMongoDB(client, "scraped_data", "products", result)
		if err != nil {
			log.Printf("Error saving data to MongoDB for URL %s: %v\n", url, err)
		}
	}

	fmt.Println("Scraping and data upload completed!")
}

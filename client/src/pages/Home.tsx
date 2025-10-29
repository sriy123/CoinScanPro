import { useState } from "react";
import UploadZone from "@/components/UploadZone";
import CoinResults from "@/components/CoinResults";
import CurrencyConverter from "@/components/CurrencyConverter";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Coins, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [coinData, setCoinData] = useState<any>(null);
  const { toast } = useToast();

  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setIsAnalyzing(true);

      // todo: remove mock functionality - simulate API call
      setTimeout(() => {
        // Mock coin identification results
        const mockResults = [
          {
            coinType: "Quarter Dollar",
            country: "United States",
            countryFlag: "🇺🇸",
            denomination: "25 Cents",
            year: "2020",
            confidence: 95,
            material: "Copper-Nickel",
            value: 0.25,
            currency: "USD"
          },
          {
            coinType: "1 Rupee Coin",
            country: "India",
            countryFlag: "🇮🇳",
            denomination: "1 Rupee",
            year: "2019",
            confidence: 92,
            material: "Stainless Steel",
            value: 1,
            currency: "INR"
          },
          {
            coinType: "50 Euro Cent",
            country: "European Union",
            countryFlag: "🇪🇺",
            denomination: "50 Cents",
            year: "2018",
            confidence: 89,
            material: "Nordic Gold",
            value: 0.50,
            currency: "EUR"
          },
          {
            coinType: "1 Pound Coin",
            country: "United Kingdom",
            countryFlag: "🇬🇧",
            denomination: "1 Pound",
            year: "2021",
            confidence: 94,
            material: "Bi-metallic",
            value: 1,
            currency: "GBP"
          }
        ];

        const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
        setCoinData(randomResult);
        setIsAnalyzing(false);
        
        toast({
          title: "Coin Identified!",
          description: `Found: ${randomResult.coinType}`,
        });
      }, 1500);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setUploadedImage(null);
    setCoinData(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Coins className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold" data-testid="text-app-title">CoinID</h1>
                <p className="text-xs text-muted-foreground">Instant Coin Recognition</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {coinData && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  data-testid="button-new-scan"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Scan
                </Button>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        {!uploadedImage ? (
          <div className="space-y-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto mb-12">
              <h2 className="text-4xl font-bold">Identify Any Coin Instantly</h2>
              <p className="text-lg text-muted-foreground">
                Upload a photo of your coin to identify its type, country, denomination, and convert its value to any currency
              </p>
            </div>
            <UploadZone onImageSelect={handleImageSelect} isAnalyzing={isAnalyzing} />
          </div>
        ) : (
          <div className="space-y-8">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-medium" data-testid="text-analyzing">Analyzing coin...</p>
                <p className="text-sm text-muted-foreground">This may take a few seconds</p>
              </div>
            ) : coinData ? (
              <>
                <CoinResults
                  imageUrl={uploadedImage}
                  coinType={coinData.coinType}
                  country={coinData.country}
                  countryFlag={coinData.countryFlag}
                  denomination={coinData.denomination}
                  year={coinData.year}
                  confidence={coinData.confidence}
                  material={coinData.material}
                />
                <CurrencyConverter
                  originalAmount={coinData.value}
                  originalCurrency={coinData.currency}
                />
              </>
            ) : null}
          </div>
        )}
      </main>

      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Supports coins from USA, India, Europe, UK, Japan, China, Australia, Canada, and more
          </p>
        </div>
      </footer>
    </div>
  );
}

import { useState } from "react";
import UploadZone from "@/components/UploadZone";
import CoinResults from "@/components/CoinResults";
import CurrencyConverter from "@/components/CurrencyConverter";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Coins, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { CoinAnalysis } from "@shared/schema";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [coinData, setCoinData] = useState<CoinAnalysis | null>(null);
  const { toast } = useToast();

  const handleImageSelect = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageUrl = e.target?.result as string;
      setUploadedImage(imageUrl);
      setIsAnalyzing(true);

      try {
        // Create form data for file upload
        const formData = new FormData();
        formData.append('image', file);

        // Call the API to analyze the coin
        const response = await fetch('/api/analyze-coin', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to analyze coin');
        }

        const result: CoinAnalysis = await response.json();
        setCoinData(result);
        setIsAnalyzing(false);
        
        toast({
          title: "Coin Identified!",
          description: `Found: ${result.coinType}`,
        });
      } catch (error) {
        console.error('Error analyzing coin:', error);
        setIsAnalyzing(false);
        toast({
          title: "Analysis Failed",
          description: error instanceof Error ? error.message : "Could not identify the coin. Please try again.",
          variant: "destructive",
        });
        setUploadedImage(null);
      }
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
                Upload a photo of your coin to identify its type, country, denomination, and get an estimated collector value based on rarity, condition, and age
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
                  condition={coinData.condition}
                  rarity={coinData.rarity}
                  estimatedValue={coinData.estimatedValue}
                  estimatedValueRange={coinData.estimatedValueRange}
                  valueFactors={coinData.valueFactors}
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

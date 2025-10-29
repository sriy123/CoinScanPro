import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, MapPin, Calendar, Award, DollarSign, Star, TrendingUp } from "lucide-react";

interface CoinResultsProps {
  imageUrl: string;
  coinType: string;
  country: string;
  countryFlag: string;
  denomination: string;
  year?: string;
  confidence?: number;
  material?: string;
  condition?: string;
  rarity?: string;
  estimatedValue?: number;
  estimatedValueRange?: string;
  valueFactors?: string[];
}

export default function CoinResults({
  imageUrl,
  coinType,
  country,
  countryFlag,
  denomination,
  year,
  confidence,
  material,
  condition,
  rarity,
  estimatedValue,
  estimatedValueRange,
  valueFactors
}: CoinResultsProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto" data-testid="card-coin-results">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="w-6 h-6" />
          Coin Identification Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden border">
              <img
                src={imageUrl}
                alt="Uploaded coin"
                className="w-full h-auto object-contain max-h-80"
                data-testid="img-coin-preview"
              />
            </div>
            {confidence !== undefined && (
              <div className="flex items-center gap-2" data-testid="text-confidence">
                <Award className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Confidence: {confidence}%
                </span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2" data-testid="text-coin-type">
                {coinType}
              </h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{countryFlag}</span>
                <span className="text-lg text-muted-foreground">{country}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Coins className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Denomination</p>
                  <p className="text-xl font-semibold" data-testid="text-denomination">
                    {denomination}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Country of Origin</p>
                  <p className="text-lg" data-testid="text-country">
                    {country}
                  </p>
                </div>
              </div>

              {year && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Year</p>
                    <p className="text-lg" data-testid="text-year">{year}</p>
                  </div>
                </div>
              )}

              {material && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Material</p>
                  <Badge variant="secondary" data-testid="badge-material">{material}</Badge>
                </div>
              )}

              {(condition || rarity || estimatedValue !== undefined) && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Value Estimation
                  </h3>

                  <div className="space-y-4">
                    {condition && (
                      <div className="flex items-start gap-3">
                        <Award className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Condition</p>
                          <Badge variant="outline" className="mt-1" data-testid="badge-condition">
                            {condition}
                          </Badge>
                        </div>
                      </div>
                    )}

                    {rarity && (
                      <div className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Rarity</p>
                          <Badge variant="outline" className="mt-1" data-testid="badge-rarity">
                            {rarity}
                          </Badge>
                        </div>
                      </div>
                    )}

                    {estimatedValue !== undefined && (
                      <div className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Estimated Market Value</p>
                          <p className="text-2xl font-bold text-primary" data-testid="text-estimated-value">
                            ${estimatedValue.toFixed(2)}
                          </p>
                          {estimatedValueRange && (
                            <p className="text-sm text-muted-foreground mt-1" data-testid="text-value-range">
                              Range: {estimatedValueRange}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {valueFactors && valueFactors.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Value Factors</p>
                        <ul className="space-y-1" data-testid="list-value-factors">
                          {valueFactors.map((factor, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <span className="text-primary mt-0.5">•</span>
                              <span>{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

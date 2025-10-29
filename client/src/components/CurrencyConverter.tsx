import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rate: number;
}

const CURRENCIES: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸", rate: 1 },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺", rate: 0.92 },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧", rate: 0.79 },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳", rate: 83.12 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵", rate: 149.50 },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳", rate: 7.24 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺", rate: 1.53 },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦", rate: 1.36 },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭", rate: 0.88 },
  { code: "MXN", name: "Mexican Peso", symbol: "$", flag: "🇲🇽", rate: 17.05 },
];

interface CurrencyConverterProps {
  originalAmount: number;
  originalCurrency: string;
}

export default function CurrencyConverter({ originalAmount, originalCurrency }: CurrencyConverterProps) {
  const [targetCurrency, setTargetCurrency] = useState("EUR");

  const sourceCurrencyData = CURRENCIES.find(c => c.code === originalCurrency) || CURRENCIES[0];
  const targetCurrencyData = CURRENCIES.find(c => c.code === targetCurrency) || CURRENCIES[1];

  const convertedAmount = (originalAmount / sourceCurrencyData.rate) * targetCurrencyData.rate;
  const exchangeRate = targetCurrencyData.rate / sourceCurrencyData.rate;

  return (
    <Card className="w-full max-w-4xl mx-auto" data-testid="card-currency-converter">
      <CardHeader>
        <CardTitle>Currency Conversion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">From</label>
            <div className="p-6 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{sourceCurrencyData.flag}</span>
                <span className="font-medium">{sourceCurrencyData.code}</span>
              </div>
              <p className="text-3xl font-bold" data-testid="text-original-amount">
                {sourceCurrencyData.symbol}{originalAmount.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{sourceCurrencyData.name}</p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">To</label>
            <Select value={targetCurrency} onValueChange={setTargetCurrency}>
              <SelectTrigger className="w-full" data-testid="select-target-currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem 
                    key={currency.code} 
                    value={currency.code}
                    data-testid={`option-currency-${currency.code}`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{currency.flag}</span>
                      <span>{currency.code} - {currency.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{targetCurrencyData.flag}</span>
                <span className="font-medium">{targetCurrencyData.code}</span>
              </div>
              <p className="text-3xl font-bold text-primary" data-testid="text-converted-amount">
                {targetCurrencyData.symbol}{convertedAmount.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{targetCurrencyData.name}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-muted/30 border">
          <p className="text-sm text-muted-foreground text-center">
            Exchange Rate: 1 {sourceCurrencyData.code} = {exchangeRate.toFixed(4)} {targetCurrencyData.code}
          </p>
          <p className="text-xs text-muted-foreground text-center mt-1" data-testid="text-last-updated">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

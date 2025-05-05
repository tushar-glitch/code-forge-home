
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface SponsoredBannerProps {
  title: string;
  description: string;
  company: string;
  companyLogoUrl?: string;
  ctaText: string;
  ctaLink: string;
  backgroundImageUrl?: string;
}

const SponsoredBanner: React.FC<SponsoredBannerProps> = ({
  title,
  description,
  company,
  companyLogoUrl,
  ctaText,
  ctaLink,
  backgroundImageUrl,
}) => {
  return (
    <div 
      className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/20 to-background p-1"
      style={{
        backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Optional overlay for better text visibility */}
      {backgroundImageUrl && (
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/60"></div>
      )}
      
      <div className="relative flex items-center justify-between gap-4 rounded-lg bg-card/60 backdrop-blur-sm p-4 md:p-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {companyLogoUrl && (
              <img src={companyLogoUrl} alt={company} className="h-6 w-auto" />
            )}
            <span className="text-xs text-muted-foreground">Sponsored by {company}</span>
          </div>
          
          <h3 className="text-lg font-bold md:text-xl">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
        
        <Button className="shrink-0" asChild>
          <a href={ctaLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
            {ctaText}
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default SponsoredBanner;

// RoomCard.jsx
import React from "react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Link } from "wouter";
import {
  Wifi,
  Droplets,
  Zap,
  Shield,
  Car,
  Camera,
  Heart,
  MapPin,
  Star,
  BatteryCharging,
  Sun,
  Dog,
  CigaretteOff
} from "lucide-react";

const amenityIcons = {
  wifi: <Wifi className="w-3.5 h-3.5" />,
  borehole: <Droplets className="w-3.5 h-3.5" />,
  city_water: <Droplets className="w-3.5 h-3.5" />,
  prepaid_power: <Zap className="w-3.5 h-3.5" />,
  backup_power: <BatteryCharging className="w-3.5 h-3.5" />,
  solar_hot_water: <Sun className="w-3.5 h-3.5" />,
  security: <Shield className="w-3.5 h-3.5" />,
  cctv: <Camera className="w-3.5 h-3.5" />,
  parking: <Car className="w-3.5 h-3.5" />,
  pets_allowed: <Dog className="w-3.5 h-3.5" />,
  no_smoking: <CigaretteOff className="w-3.5 h-3.5" />
};

export function RoomCard({
  id,
  title,
  type,
  price,
  location,
  distance,
  image,
  isFavorited,
  onToggleFavorite,
  amenities = [],
  verified,
  rating,
  reviews,
  status,
}) {

  const statusConfig = {
    rented: {
      label: "RENTED",
      className: "text-red-500/80 border-red-500/40 bg-red-500/10",
      disableAction: true,
    },
    booked: {
      label: "BOOKED",
      className: "text-amber-500/80 border-amber-500/40 bg-amber-500/10",
      disableAction: true,
    },
    available: {
      label: "AVAILABLE",
      className: "text-green-500/80 border-green-500/40 bg-green-500/10",
      disableAction: false,
    },
    matched: {
      label: "MATCHED",
      className: "text-purple-500/80 border-purple-500/40 bg-purple-500/10",
      disableAction: true,
    },
  };

  const currentStatus =
    statusConfig[status?.toLowerCase?.()] || null;

  const isDisabled = currentStatus?.disableAction ?? false;

  return (
    <Card
      className="group relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
      data-testid={`card-room-${id}`}
    >
      <div className="relative aspect-4/3 overflow-hidden">

        {/* STATUS STAMP */}
        {currentStatus && (
          <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
            <div
              className={`rotate-[-35deg] text-5xl font-extrabold tracking-widest border-4 px-6 py-2 rounded-xl ${currentStatus.className}`}
            >
              {currentStatus.label}
            </div>
          </div>
        )}

        {/* IMAGE */}
        {image ? (
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.jpg";
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">
            No image
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        {/* BADGES */}
        <div className="absolute top-3 left-3 flex gap-2">
          {verified && (
            <Badge className="bg-primary text-primary-foreground gap-1">
              <Shield className="w-3 h-3" />
              Verified
            </Badge>
          )}
          <Badge variant="secondary" className="bg-white/90 text-foreground">
            {type}
          </Badge>
        </div>

        {/* FAVORITE */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isDisabled) onToggleFavorite?.();
          }}
          disabled={isDisabled}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
            isFavorited
              ? "bg-red-500 text-white"
              : "bg-white/90 text-muted-foreground hover:text-red-500"
          } ${isDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
        </button>

        {/* FOOTER INFO */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <p className="text-white/80 text-sm flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {distance} from your current position
          </p>

          {rating && (
            <div className="flex items-center gap-1 bg-white/90 rounded-full px-2 py-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium">{rating}</span>
              {reviews && (
                <span className="text-xs text-muted-foreground">
                  ({reviews})
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5" />
            {location}
          </p>
        </div>

        <div className="flex gap-2">
          {amenities.slice(0, 3).map((amenity) => (
            <div
              key={amenity}
              className="flex items-center gap-1 text-xs text-muted-foreground bg-muted rounded-full px-2 py-1"
            >
              {amenityIcons[amenity.toLowerCase?.()]}
              <span className="capitalize">{amenity}</span>
            </div>
          ))}
        </div>

        {/* PRICE + BUTTON */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div>
            <span className="text-xl font-bold text-primary">
              KES {price?.toLocaleString?.()}
            </span>
            <span className="text-sm text-muted-foreground">/month</span>
          </div>

          {isDisabled ? (
            <Button size="sm" disabled className="opacity-50 cursor-not-allowed">
              Not Available
            </Button>
          ) : (
            <Link href={`/room?room=${id}`}>
              <Button size="sm">View Details</Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
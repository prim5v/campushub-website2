import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { X, Home } from "lucide-react";

export default function RoomRequestModal({ open, onClose }) {

  const [images, setImages] = useState([
    "/room1.jfif",
    "/room2.jfif",
    "/room3.jfif",
    "/room4.jfif"
  ]);

  const [selected, setSelected] = useState(null);

  // lock scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  // auto shuffle images
  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      setImages((prev) => {
        const shuffled = [...prev].sort(() => Math.random() - 0.5);
        return shuffled;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <Card className="relative w-[95%] max-w-xl rounded-2xl shadow-2xl">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-lg hover:bg-muted"
        >
          <X className="w-5 h-5" />
        </button>

        <CardContent className="p-8 space-y-6 text-center">

          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold">
              Are you looking for a room?
            </h2>

            <p className="text-muted-foreground mt-2">
              If so, make a request immediately on CampusHub and secure a room near your campus.
            </p>
          </div>

          {/* 4 Image Grid */}
          <div className="grid grid-cols-2 gap-3">

            {images.map((img, i) => (
              <div
                key={i}
                onClick={() => setSelected(i)}
                className={`
                  relative overflow-hidden rounded-xl cursor-pointer
                  transition-all duration-300
                  hover:scale-105
                  ${selected === i ? "ring-4 ring-primary scale-105" : ""}
                `}
              >
                <img
                  src={img}
                  alt="Room preview"
                  className="w-full h-28 object-cover"
                />
              </div>
            ))}

          </div>

          {/* CTA */}
          <Link href="/room-request">
            <Button
              className="w-full gap-2"
              onClick={onClose}
            >
              <Home className="w-4 h-4" />
              Make Room Request
            </Button>
          </Link>

        </CardContent>
      </Card>
    </div>
  );
}
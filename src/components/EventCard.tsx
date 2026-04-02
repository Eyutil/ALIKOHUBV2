import { CalendarDays, MapPin } from "lucide-react";

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  image: string;
  price?: string;
  category?: string;
}

const EventCard = ({ title, date, location, image, price, category }: EventCardProps) => {
  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 border border-border hover:border-primary/20 cursor-pointer">
      <div className="relative overflow-hidden aspect-[16/10]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {category && (
          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold font-body rounded-full bg-primary text-primary-foreground">
            {category}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="space-y-1.5 font-body text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-3.5 h-3.5 text-accent" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-accent" />
            <span>{location}</span>
          </div>
        </div>
        {price && (
          <p className="mt-3 text-sm font-semibold font-body text-primary">
            From {price}
          </p>
        )}
      </div>
    </div>
  );
};

export default EventCard;

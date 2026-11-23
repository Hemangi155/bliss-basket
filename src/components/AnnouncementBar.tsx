import MaterialIcon from "./MaterialIcon";

export default function AnnouncementBar() {
  return (
    <div className="bg-light-primary text-light-on-primary py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-center">
        <MaterialIcon
          name="local_shipping"
          className="text-title-md text-champagne-gold"
        />
        <p className="font-body text-body-md">
          Complimentary Pan-India Delivery on Orders Above ₹2,499 · Use Code{" "}
          <span className="font-mono text-mono-sm bg-light-on-primary/15 px-2 py-0.5 rounded-sm">
            BLISS10
          </span>{" "}
          for 10% Off Your First Hamper
        </p>
      </div>
    </div>
  );
}

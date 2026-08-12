import { useRef, useState } from "react";
import { CheckCircle2, ImagePlus, X } from "lucide-react";

const requirementOptions = ["Buy", "Sell", "Rent", "Lease"] as const;
const propertyTypes = [
  "Residential",
  "Commercial",
  "Plot/Land",
  "Agriculture Land",
  "Apartment",
  "House",
  "Villa",
  "Office",
  "Shop",
  "Other",
];
const preferredLocationSuggestions = ["Amritsar", "Gurdaspur", "Batala", "Dinanagar"];
const MAX_PHOTO_SIZE_BYTES = 10 * 1024 * 1024;
const WHATSAPP_NUMBER = "918269000066";

interface Props {
  defaultRequirement?: (typeof requirementOptions)[number];
  compact?: boolean;
}

interface PhotoAsset {
  id: string;
  file: File;
  url: string;
}

export default function RequirementForm({ defaultRequirement, compact }: Props) {
  const [requirement, setRequirement] = useState<string>(defaultRequirement ?? "Buy");
  const [submitted, setSubmitted] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<PhotoAsset[]>([]);
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const handlePhotoSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const validFiles = files.filter((file) => file.type.startsWith("image/") && file.size <= MAX_PHOTO_SIZE_BYTES);

    if (validFiles.length !== files.length) {
      setPhotoError("Please upload valid image files under 10MB.");
    } else {
      setPhotoError("");
    }

    const accepted = validFiles.filter((file) => {
      const duplicate = selectedPhotos.some(
        (photo) =>
          photo.file.name === file.name &&
          photo.file.size === file.size &&
          photo.file.lastModified === file.lastModified,
      );
      return !duplicate;
    });

    if (accepted.length === 0) {
      event.target.value = "";
      return;
    }

    const nextPhotos = accepted.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(16).slice(2)}`,
      file,
      url: URL.createObjectURL(file),
    }));

    setSelectedPhotos((current) => [...current, ...nextPhotos]);
    event.target.value = "";
  };

  const removePhoto = (id: string) => {
    setSelectedPhotos((current) => {
      const photo = current.find((item) => item.id === id);
      if (photo) {
        URL.revokeObjectURL(photo.url);
      }
      return current.filter((item) => item.id !== id);
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = formRef.current;
    if (!form) return;

    if (!form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    const values = {
      propertyType: String(formData.get("propertyType") ?? ""),
      preferredLocation: String(formData.get("preferredLocation") ?? ""),
      budget: String(formData.get("budget") ?? ""),
      propertySize: String(formData.get("propertySize") ?? ""),
      bedrooms: String(formData.get("bedrooms") ?? ""),
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      whatsapp: String(formData.get("whatsapp") ?? ""),
      email: String(formData.get("email") ?? ""),
      additionalRequirements: String(formData.get("additionalRequirements") ?? ""),
    };

    if (requirement !== "Sell") {
      setSubmitted(true);
      return;
    }

    const messageLines = [
      "NEW PROPERTY SELLING ENQUIRY",
      "",
      "━━━━━━━━━━━━━━━━━━",
      "",
      "PROPERTY DETAILS",
    ];

    const details = [
      ["Property Type", values.propertyType],
      ["Preferred Location", values.preferredLocation],
      ["Budget", values.budget],
      ["Property Size", values.propertySize],
      ["Bedrooms", values.bedrooms],
    ].filter(([, value]) => value && value.trim() !== "");

    details.forEach(([label, value]) => {
      messageLines.push(`${label}: ${value}`);
    });

    messageLines.push("", "OWNER DETAILS");

    [
      ["Name", values.name],
      ["Phone", values.phone],
      ["WhatsApp", values.whatsapp],
      ["Email", values.email],
    ].forEach(([label, value]) => {
      if (value && value.trim() !== "") {
        messageLines.push(`${label}: ${value}`);
      }
    });

    if (values.additionalRequirements && values.additionalRequirements.trim() !== "") {
      messageLines.push("", "ADDITIONAL REQUIREMENTS", values.additionalRequirements.trim());
    }

    if (selectedPhotos.length > 0) {
      const selectedPhotoUrls = selectedPhotos.map((photo, index) => `Photo ${index + 1}: ${photo.file.name}`);
      messageLines.push("", "PROPERTY PHOTOS");
      selectedPhotoUrls.forEach((line) => messageLines.push(line));
      if (!navigator.canShare || !navigator.canShare({ files: selectedPhotos.map((photo) => photo.file) })) {
        messageLines.push("Selected photos are ready to share from the device when supported by the browser.");
      }
    }

    messageLines.push("", "━━━━━━━━━━━━━━━━━━", "", "Source:", "Khehhra Group Website");

    const completeMessage = messageLines.join("\n");
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(completeMessage)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    if (typeof navigator !== "undefined" && navigator.share) {
      const sharePayload = {
        text: completeMessage,
        files: selectedPhotos.length > 0 ? selectedPhotos.map((photo) => photo.file) : undefined,
      };

      if (navigator.canShare && sharePayload.files && navigator.canShare(sharePayload)) {
        navigator.share(sharePayload).catch(() => undefined);
      } else if (!sharePayload.files) {
        navigator.share({ text: completeMessage }).catch(() => undefined);
      }
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-champagne/40 bg-white px-8 py-16 text-center shadow-sm">
        <CheckCircle2 className="text-blue" size={44} />
        <h3 className="font-display text-2xl font-semibold text-navy">Thank You!</h3>
        <p className="max-w-sm text-sm text-stone">
          Your Sell enquiry has been prepared and sent to WhatsApp for review.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-3 text-sm font-semibold uppercase tracking-wider text-blue underline underline-offset-4"
        >
          Submit another requirement
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`rounded-3xl border border-champagne/40 bg-white shadow-[0_20px_60px_-25px_rgba(16,35,63,0.25)] ${
        compact ? "p-6 sm:p-8" : "p-7 sm:p-10"
      }`}
    >
      <div className="mb-6">
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-blue">I want to</span>
        <div className="mt-3 flex flex-wrap gap-2">
          {requirementOptions.map((opt) => (
            <button
              type="button"
              key={opt}
              onClick={() => setRequirement(opt)}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all ${
                requirement === opt
                  ? "border-navy bg-navy text-white"
                  : "border-champagne/60 bg-ivory text-navy/70 hover:border-navy/40"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {requirement === "Sell" && (
        <div className="mb-6">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-blue">Property Photos</span>
          <div className="mt-3 rounded-2xl border border-dashed border-champagne bg-cream/40 p-4">
            <div className="mb-3 flex items-center gap-3 text-navy">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-champagne/70 bg-white text-blue">
                <ImagePlus size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold">Add Property Photos</p>
                <p className="text-xs text-stone">Select photos from your gallery</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full border border-navy/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-navy transition-colors hover:border-blue hover:text-blue"
            >
              Choose Photos
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoSelection}
              className="hidden"
            />
          </div>

          {photoError && <p className="mt-2 text-xs font-medium text-red-600">{photoError}</p>}

          {selectedPhotos.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {selectedPhotos.map((photo) => (
                <div key={photo.id} className="relative h-16 w-16 overflow-hidden rounded-xl border border-champagne/70 bg-ivory">
                  <img src={photo.url} alt={photo.file.name} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-navy text-[10px] text-white shadow-sm"
                    aria-label={`Remove ${photo.file.name}`}
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-16 w-16 items-center justify-center rounded-xl border border-dashed border-champagne bg-ivory text-xs font-semibold uppercase tracking-[0.15em] text-stone"
              >
                + Add
              </button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Property Type">
          <select required name="propertyType" className="form-select">
            <option value="">Select property type</option>
            {propertyTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Preferred Location">
          <input
            required
            name="preferredLocation"
            type="text"
            list="preferred-locations"
            placeholder="e.g. Batala, Gurdaspur, Amritsar or Dinanagar"
            className="form-input"
          />
          <datalist id="preferred-locations">
            {preferredLocationSuggestions.map((location) => (
              <option key={location} value={location} />
            ))}
          </datalist>
        </Field>

        <Field label="Budget">
          <input name="budget" type="text" placeholder="e.g. \u20b9 30 - 50 Lakh" className="form-input" />
        </Field>

        <Field label="Property Size">
          <input name="propertySize" type="text" placeholder="e.g. 1200 sq.ft / 200 sq.yd" className="form-input" />
        </Field>

        <Field label="Bedrooms">
          <select name="bedrooms" className="form-select">
            <option value="">Not Applicable</option>
            {["1", "2", "3", "4", "5+"].map((n) => (
              <option key={n} value={n}>
                {n} BHK
              </option>
            ))}
          </select>
        </Field>

        <Field label="Name">
          <input required name="name" type="text" placeholder="Your full name" className="form-input" />
        </Field>

        <Field label="Phone">
          <input required name="phone" type="tel" placeholder="10-digit mobile number" className="form-input" />
        </Field>

        <Field label="WhatsApp">
          <input name="whatsapp" type="tel" placeholder="WhatsApp number" className="form-input" />
        </Field>

        <Field label="Email" full>
          <input name="email" type="email" placeholder="you@example.com" className="form-input" />
        </Field>

        <Field label="Additional Requirements" full>
          <textarea
            name="additionalRequirements"
            rows={3}
            placeholder="Tell us anything else about what you're looking for..."
            className="form-input resize-none"
          />
        </Field>
      </div>

      <button
        type="submit"
        className="mt-7 w-full rounded-full bg-navy py-4 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-navy/20 transition-colors hover:bg-navy-light sm:w-auto sm:px-10"
      >
        Get Property Assistance
      </button>
    </form>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`flex flex-col gap-2 ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-semibold uppercase tracking-wider text-stone">{label}</span>
      {children}
    </label>
  );
}

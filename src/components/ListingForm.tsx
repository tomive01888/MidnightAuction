"use client";

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import { Listing } from "@/lib/types";
import DOMPurify from "dompurify";
import { add } from "date-fns";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";

export interface ListingFormData {
  title: string;
  description: string;
  tags: string[];
  media: { url: string; alt: string }[];
  endsAt: Date;
}

interface ListingFormProps {
  initialData?: Partial<Listing>;
  onSubmit: (data: ListingFormData) => void;
  isLoading: boolean;
  submitButtonText?: string;
}

const durationOptions = [
  { label: "3 Days", value: 3 },
  { label: "7 Days", value: 7 },
  { label: "14 Days", value: 14 },
  { label: "30 Days", value: 30 },
];

export default function ListingForm({
  initialData = {},
  onSubmit,
  isLoading,
  submitButtonText = "Submit Listing",
}: ListingFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [duration, setDuration] = useState(7);
  const [media, setMedia] = useState([{ url: "", alt: "" }]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setTags((initialData.tags || []).join(", "));
      setMedia(initialData.media && initialData.media.length > 0 ? initialData.media : [{ url: "", alt: "" }]);
    }
  }, [initialData]);

  const handleMediaChange = (index: number, value: string) => {
    const newMedia = [...media];
    newMedia[index].url = value;
    setMedia(newMedia);
  };

  const addMediaField = () => {
    if (media.length < 4) {
      setMedia([...media, { url: "", alt: "" }]);
    }
  };

  const removeMediaField = (index: number) => {
    const newMedia = media.filter((_, i) => i !== index);
    setMedia(newMedia);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizedTitle = DOMPurify.sanitize(title);
    const sanitizedDescription = DOMPurify.sanitize(description);

    const parsedTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const parsedMedia = media
      .filter((item) => item.url.trim() !== "")
      .map((item) => ({
        url: DOMPurify.sanitize(item.url.trim()),
        alt: DOMPurify.sanitize(item.alt.trim()) || `Image for ${sanitizedTitle}`,
      }));

    const endsAtDate = add(new Date(), { days: duration });

    onSubmit({
      title: sanitizedTitle,
      description: sanitizedDescription,
      tags: parsedTags,
      media: parsedMedia,
      endsAt: endsAtDate,
    });
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, borderRadius: 4 }} aria-labelledby="form-title">
      <Typography id="form-title" variant="h4" component="h1" sx={{ fontFamily: "var(--font-orbitron)", mb: 3 }}>
        {initialData.id ? "Edit Listing" : "Create a New Listing"}
      </Typography>

      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        fullWidth
        margin="normal"
        aria-required="true"
      />

      <TextField
        aria-label="Description"
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        rows={4}
        margin="normal"
        id="description-field"
      />

      <TextField
        label="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
        margin="normal"
        helperText="e.g., art, collectible, rare"
      />

      <Typography component="h2" variant="h6" sx={{ mt: 2, mb: 1 }} id="images-section-label">
        Images (max 4)
      </Typography>

      <Box role="group" aria-labelledby="images-section-label" sx={{ mb: 2 }}>
        {media.map((item, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <TextField
              label={`Image URL ${index + 1}`}
              value={item.url}
              onChange={(e) => handleMediaChange(index, e.target.value)}
              fullWidth
              required={index === 0}
            />
            {media.length > 1 && (
              <IconButton
                onClick={() => removeMediaField(index)}
                aria-label={`Remove image URL ${index + 1}`}
                type="button"
              >
                <RemoveCircleOutline />
              </IconButton>
            )}
          </Box>
        ))}
      </Box>

      <Button
        startIcon={<AddCircleOutline />}
        onClick={addMediaField}
        disabled={media.length >= 4}
        aria-label={`Add another image URL. ${media.length} of 4 images added.`}
        type="button"
      >
        Add Another Image
      </Button>

      {!initialData.id && (
        <FormControl fullWidth margin="normal">
          <InputLabel id="duration-select-label" htmlFor="duration-select">
            Auction Duration
          </InputLabel>
          <Select
            value={duration}
            label="Auction Duration"
            onChange={(e) => setDuration(e.target.value as number)}
            labelId="duration-select-label"
            id="duration-select"
            inputProps={{
              id: "duration-select",
            }}
          >
            {durationOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <Box sx={{ mt: 3 }}>
        <Button type="submit" variant="contained" size="large" fullWidth disabled={isLoading} aria-busy={isLoading}>
          {isLoading ? (
            <>
              <CircularProgress size={24} color="inherit" aria-hidden="true" />
              <span style={{ marginLeft: 8 }}>Submitting...</span>
            </>
          ) : (
            submitButtonText
          )}
        </Button>
      </Box>
    </Paper>
  );
}

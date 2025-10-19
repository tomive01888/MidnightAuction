"use-client";

import { useState, useEffect } from "react";
import { Box, Button, Modal, Paper, Typography, TextField, CircularProgress, IconButton } from "@mui/material";
import { Edit, Close } from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation } from "@/hooks/useMutation";
import AuctionApi, { UpdateProfilePayload } from "@/lib/api";
import { UserProfile } from "@/lib/types";
import DOMPurify from "dompurify";

interface EditProfileProps {
  onUpdateSuccess: () => void;
}

export default function EditProfile({ onUpdateSuccess }: EditProfileProps) {
  const { userProfile, accessToken, updateProfile: updateAuthContext } = useAuth();

  const [open, setOpen] = useState(false);
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (userProfile) {
      setBio(userProfile.bio || "");
      setAvatarUrl(userProfile.avatar?.url || "");
    }
  }, [userProfile]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updateMutation = useMutation(
    (payload: UpdateProfilePayload): Promise<{ data: UserProfile }> => {
      const api = new AuctionApi(accessToken!);
      return api.updateProfile(userProfile!.name, payload);
    },
    {
      onSuccess: (result) => {
        const updatedProfile: UserProfile = {
          ...userProfile!,
          ...result.data,
        };

        updateAuthContext(updatedProfile);

        handleClose();
        onUpdateSuccess();
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    const sanitizedBio = DOMPurify.sanitize(bio);
    const sanitizedAvatarUrl = DOMPurify.sanitize(avatarUrl);

    const payload: UpdateProfilePayload = {
      bio: sanitizedBio,
      avatar: {
        url: sanitizedAvatarUrl,
        alt: `${userProfile.name}'s avatar`,
      },
    };

    updateMutation.mutate(payload);
  };

  return (
    <>
      <Button variant="contained" startIcon={<Edit />} onClick={handleOpen}>
        Edit Profile
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 500 },
            borderRadius: 4,
            p: 4,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography
              id="edit-profile-modal-title"
              variant="h5"
              component="h2"
              sx={{ fontFamily: "var(--font-orbitron)" }}
            >
              Update Your Profile
            </Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>

          <TextField
            label="Avatar URL"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />

          <Box sx={{ mt: 2 }}>
            <Button type="submit" fullWidth variant="contained" disabled={updateMutation.isLoading}>
              {updateMutation.isLoading ? <CircularProgress size={24} color="inherit" /> : "Save Changes"}
            </Button>
          </Box>
        </Paper>
      </Modal>
    </>
  );
}

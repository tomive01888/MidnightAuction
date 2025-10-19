"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, IconButton } from "@mui/material";
import { Edit, DeleteForever } from "@mui/icons-material";
import { Listing } from "@/lib/types";
import { useMutation } from "@/hooks/useMutation";
import AuctionApi from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import ListingCard from "@/components/ListingCard";
import ConfirmationDialog from "./ConfirmationDialog";

interface ManagedListingCardProps {
  listing: Listing;
  index: number;
  onDeleteSuccess: () => void;
}

export default function ManagedListingCard({ listing, index, onDeleteSuccess }: ManagedListingCardProps) {
  const router = useRouter();
  const { accessToken } = useAuth();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteMutation = useMutation(
    (id: string) => {
      const api = new AuctionApi(accessToken!);
      return api.deleteListing(id);
    },
    {
      onSuccess: () => {
        toast.success(`"${listing.title}" was successfully deleted.`);
        setIsDeleteDialogOpen(false);
        onDeleteSuccess();
      },
      onError: (errorMessage) => {
        toast.error(`Failed to delete listing: ${errorMessage}`);
      },
    }
  );

  const handleEdit = () => {
    router.push(`/listings/${listing.id}/edit`);
  };

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(listing.id);
  };

  const hasLinstingEnded = listing.endsAt ? new Date(listing.endsAt) < new Date() : false;

  return (
    <>
      <Box component={"article"} sx={{ display: "flex", flexDirection: "column", flexWrap: "wrap", width: "100%" }}>
        <ListingCard listing={listing} index={index} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
            backgroundColor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "0 0 16px 16px",
            mt: "-16px",
            pt: "24px",
            zIndex: 2,
          }}
        >
          {!hasLinstingEnded && (
            <>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Manage Listing
              </Typography>
              <Box>
                <IconButton
                  aria-label={`Edit ${listing.title}`}
                  onClick={handleEdit}
                  color="primary"
                  size="small"
                  sx={{ "&:hover": { bgcolor: "#00F59F50" } }}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  aria-label={`Delete ${listing.title}`}
                  onClick={openDeleteDialog}
                  color="error"
                  size="small"
                  sx={{ "&:hover": { bgcolor: "#F5000050" } }}
                >
                  <DeleteForever />
                </IconButton>
              </Box>
            </>
          )}
        </Box>
      </Box>
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete Listing?"
        description={`Are you sure you want to permanently delete "${listing.title}"? This action cannot be undone.`}
      />
    </>
  );
}

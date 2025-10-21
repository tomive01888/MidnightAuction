import { Box, Paper, Typography, Skeleton } from "@mui/material";
import { keyframes } from "@mui/system";

const dotAnimation = keyframes`
  0%, 20% { opacity: 0; }
  40% { opacity: 1; }
  100% { opacity: 0; }
`;

export default function ProfileHeaderSkeleton() {
  return (
    <Box
      role="status"
      component="section"
      sx={{ wdith: "100%", display: "flex", flexDirection: { xs: "column", md: "row" }, gap: { xs: 4, md: 6 } }}
    >
      <Box sx={{ flex: 1, display: "flex", wdith: "100%", flexDirection: "column", alignItems: "center" }}>
        {/* Avatar Skeleton */}
        <Skeleton
          variant="circular"
          width={220}
          height={220}
          sx={{ mb: 2, border: "4px solid", borderColor: "divider" }}
        />

        {/* Name Skeleton */}
        <Skeleton variant="text" width={200} height={56} />

        {/* Email Skeleton */}
        <Skeleton variant="text" width={250} height={24} sx={{ mb: "8px" }} />

        {/* Bio Skeleton */}
        <Skeleton variant="text" width="90%" height={24} />

        {/* Credits Card Skeleton */}
        <Paper
          elevation={4}
          sx={{
            p: 3,
            borderRadius: 4,
            mt: "30px",
            textAlign: "center",
            backgroundColor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            width: "100%",
            maxWidth: "300px",
            height: "206px",
          }}
        >
          <Skeleton variant="circular" width={40} height={40} sx={{ mx: "auto", mb: 1 }} />
          <Skeleton variant="text" width={120} height={64} sx={{ mx: "auto", mb: 1 }} />
          <Skeleton variant="text" width={80} height={20} sx={{ mx: "auto" }} />
        </Paper>
      </Box>

      {/* Right Column - Stats Chart */}
      <Box
        sx={{
          wdith: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          gap: "2rem",
        }}
      >
        {/* Stats Chart Placeholder */}
        <Box
          sx={{
            width: "100%",
            height: 340,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            component={"div"}
            variant="h4"
            sx={{ color: "text.secondary", mb: 1, fontFamily: "var(--font-orbitron)" }}
          >
            Loading profile stats
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                gap: "2px",
                ml: "2px",
              }}
            >
              <Box
                component="span"
                sx={{
                  animation: `${dotAnimation} 1.4s infinite`,
                  animationDelay: "0s",
                }}
              >
                .
              </Box>
              <Box
                component="span"
                sx={{
                  animation: `${dotAnimation} 1.4s infinite`,
                  animationDelay: "0.2s",
                }}
              >
                .
              </Box>
              <Box
                component="span"
                sx={{
                  animation: `${dotAnimation} 1.4s infinite`,
                  animationDelay: "0.4s",
                }}
              >
                .
              </Box>
            </Box>
          </Typography>
        </Box>

        <Box
          sx={{
            width: "135px",
            position: { xs: "block", md: "absolute" },
            alignSelf: "end",
            top: { xs: 16, md: 24 },
            right: { xs: 16, md: 24 },
          }}
        >
          <Skeleton width={"100%"} height={56} />
        </Box>
        <Box
          component={"div"}
          sx={{
            display: "flex",
            gap: 4,
          }}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <Box
              key={index}
              component={"span"}
              sx={{
                display: "flex",
                gap: 0.5,
              }}
            >
              <Skeleton variant="circular" width={20} height={20} />
              <Typography component={"p"} variant="body2" sx={{ color: "#a7a7a7ff" }}>
                Stat loading
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

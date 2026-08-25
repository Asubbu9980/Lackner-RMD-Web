import { Box, Typography } from "@mui/material";
import { Handle, Position } from "@xyflow/react";

import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import SavingsRoundedIcon from "@mui/icons-material/SavingsRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";

const iconMap = {
  begin: AccountBalanceWalletRoundedIcon,
  growth: TrendingUpRoundedIcon,
  portfolio: SavingsRoundedIcon,
  rmd: PaymentsRoundedIcon,
  tax: ReceiptLongRoundedIcon,
  cash: MonetizationOnRoundedIcon,
  remaining: SavingsRoundedIcon,
};

export default function JourneyNode({ data }) {
  const Icon = iconMap[data.type] || SavingsRoundedIcon;

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{
          opacity: 0,
        }}
      />

      <Box
        sx={{
          width: 240,

          borderRadius: "20px",

          overflow: "hidden",

          background:
            "linear-gradient(180deg,#172033,#0f172a)",

          border: `2px solid ${data.color}`,

          boxShadow: `0 10px 40px ${data.color}25`,

          transition: ".3s",

          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: `0 20px 55px ${data.color}55`,
          },
        }}
      >
        <Box
          sx={{
            height: 5,
            background: data.color,
          }}
        />

       <Box
  sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }}
>
  <Box
    sx={{
      width: 46,
      height: 46,
      borderRadius: "50%",
      display: "grid",
      placeItems: "center",
      bgcolor: `${data.color}22`,
    }}
  >
    <Icon
      sx={{
        color: data.color,
      }}
    />
  </Box>

  <Typography
    sx={{
      mt: 1,
      color: "#cbd5e1",
      fontWeight: 700,
      fontSize: 15,
      textAlign: "center",
    }}
  >
    {data.title}
  </Typography>
</Box>

          <Typography
            sx={{
              mt: 2,

              fontWeight: 800,

              fontSize: 28,

              color: "#fff",

              fontVariantNumeric: "tabular-nums",

              textAlign: "right",
              width: "100%",
            }}
          >
            $
            {Math.round(data.value).toLocaleString()}
          </Typography>

          <Typography
            sx={{
              mt: 1,

              color: "#94a3b8",

              fontSize: 13,
            }}
          >
            {data.subtitle}
          </Typography>
        </Box>
      

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          opacity: 0,
        }}
      />
    </>
  );
}
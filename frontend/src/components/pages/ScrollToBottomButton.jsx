import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import { ArrowDownward } from "@mui/icons-material";

const ScrollToBottomButton = () => {
  const [showButton, setShowButton] = useState(false);

  // Cek apakah tombol harus ditampilkan
  const handleScroll = () => {
    if (
      window.scrollY <
      document.documentElement.scrollHeight - window.innerHeight
    ) {
      setShowButton(true); // Tampilkan tombol jika belum sampai bawah
    } else {
      setShowButton(false); // Sembunyikan tombol jika sudah di bawah
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <>
      {showButton && (
        <IconButton
          onClick={scrollToBottom}
          sx={{
            position: "fixed",
            bottom: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#fff",
            borderRadius: "50%",
            boxShadow: 3,
            padding: 2,
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          <ArrowDownward />
        </IconButton>
      )}
    </>
  );
};

export default ScrollToBottomButton;

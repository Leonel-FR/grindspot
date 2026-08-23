"use client";

import { useState } from "react";
import EmailModal from "@/components/EmailModal";
import { useLanguage } from "@/components/LanguageProvider";

export default function UnlockAccessCTA() {
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="mt-4 cursor-pointer rounded-lg bg-[#FF5A5F] px-6 py-3 font-bold text-white"
      >
        {t("spotPage.ctaButton")}
      </button>
      {modalOpen && <EmailModal onClose={() => setModalOpen(false)} />}
    </>
  );
}

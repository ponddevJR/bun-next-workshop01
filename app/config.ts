import Swal from "sweetalert2";

const config: { apiURL: string; tokenKey: string; confirmDialog: any } = {
  apiURL: "http://localhost:8000",
  tokenKey: "tkdjfidsjfo039094-233+2++5161629873p4(*#*JDOS98892dmca[[sl)mps=@)",
  confirmDialog: () => {
    return Swal.fire({
      icon: "question",
      iconColor: "#9ca3af",
      title: "ยืนยันการลบ",
      text:"ต้องการลบข้อมูลนี้หรือไม่?",
      showCancelButton: true,
      confirmButtonText:"ลบ",
      background: "#1f2937",
      color: "#9ca3af",
      customClass: {
        title: "custom-title-class",
        htmlContainer: "custom-text-class",
      },
    });
  },
};

export default config;

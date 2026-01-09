import { useState } from "react";

interface AlertConfig {
  title: string;
  message?: string;
  buttons?: {
    text: string;
    onPress?: () => void;
    style?: "default" | "cancel" | "destructive";
  }[];
  icon?: string;
  iconColor?: string;
}

export const useCustomAlert = () => {
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);
  const [visible, setVisible] = useState(false);

  const showAlert = (config: AlertConfig) => {
    setAlertConfig(config);
    setVisible(true);
  };

  const hideAlert = () => {
    setVisible(false);
    setTimeout(() => setAlertConfig(null), 300);
  };

  const alert = {
    visible,
    config: alertConfig,
    show: showAlert,
    hide: hideAlert,
  };

  return alert;
};

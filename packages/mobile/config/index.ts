import { Platform } from "react-native";
import Purchases from "react-native-purchases";

export function configureiOSInAppPurchases() {
  if (Platform.OS === "ios") {
    Purchases.configure({ apiKey: "appl_arHqkPhtLmsMEhGEEtULGYldjih" });
    console.log("Configured in app purchases");
  }
}

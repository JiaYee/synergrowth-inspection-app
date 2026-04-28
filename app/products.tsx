import {
    deleteProduct,
    loadProducts,
    type ProductRecord,
} from "@/services/product-catalog";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const MANAGE_PRODUCTS_PASSCODE = "1234";

export default function ProductsScreen() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  const refresh = useCallback(async () => {
    setProducts(await loadProducts());
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!isUnlocked) return;
      void refresh();
    }, [isUnlocked, refresh]),
  );

  const submitPasscode = () => {
    if (passcode === MANAGE_PRODUCTS_PASSCODE) {
      setPasscode("");
      setPasscodeError("");
      setIsUnlocked(true);
      void refresh();
      return;
    }

    setPasscodeError("Incorrect passcode.");
    setPasscode("");
  };

  const cancelPasscode = () => {
    setPasscode("");
    setPasscodeError("");
    router.replace("/");
  };

  const confirmDelete = (p: ProductRecord) => {
    Alert.alert(
      "Delete product",
      `Remove "${p.name}" and all its inspection points?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteProduct(p.id);
            await refresh();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={!isUnlocked}
        transparent
        animationType="fade"
        onRequestClose={cancelPasscode}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.passcodeModal}>
            <Text style={styles.modalTitle}>Manage products</Text>
            <Text style={styles.modalMessage}>
              Enter the numeric passcode to manage products and reference
              photos.
            </Text>
            <TextInput
              style={styles.passcodeInput}
              value={passcode}
              onChangeText={(value) => {
                setPasscode(value.replace(/\D/g, ""));
                if (passcodeError) setPasscodeError("");
              }}
              placeholder="Passcode"
              placeholderTextColor="#999"
              secureTextEntry
              keyboardType="number-pad"
              inputMode="numeric"
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={submitPasscode}
            />
            {passcodeError ? (
              <Text style={styles.passcodeError}>{passcodeError}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={submitPasscode}
            >
              <Text style={styles.primaryBtnText}>Unlock</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={cancelPasscode}
            >
              <Text style={styles.secondaryBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>Products</Text>
      <Text style={styles.subtitle}>
        Create products and add inspection points with reference photos.
      </Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No products yet. Tap Add product.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardMain}
              onPress={() =>
                router.push({
                  pathname: "/product-form",
                  params: { id: item.id },
                })
              }
            >
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardMeta}>
                {item.inspectionPoints.length} inspection point(s)
              </Text>
            </TouchableOpacity>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.smallBtn}
                onPress={() =>
                  router.push({
                    pathname: "/points-list",
                    params: { productId: item.id },
                  })
                }
              >
                <Text style={styles.smallBtnText}>Points</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallBtn, styles.dangerOutline]}
                onPress={() => confirmDelete(item)}
              >
                <Text style={styles.dangerText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => router.push("/product-form")}
      >
        <Text style={styles.primaryBtnText}>Add product</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() => router.back()}
      >
        <Text style={styles.secondaryBtnText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    paddingTop: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
    flexGrow: 1,
  },
  empty: {
    color: "#888",
    textAlign: "center",
    marginTop: 32,
  },
  card: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
  },
  cardMain: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  cardMeta: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  cardActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  smallBtn: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#000",
  },
  smallBtnText: {
    color: "#FFF",
    fontWeight: "600",
  },
  dangerOutline: {
    backgroundColor: "#FFF",
    borderLeftWidth: 1,
    borderLeftColor: "#E0E0E0",
  },
  dangerText: {
    color: "#DC143C",
    fontWeight: "600",
  },
  primaryBtn: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  primaryBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryBtn: {
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
  secondaryBtnText: {
    color: "#333",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  passcodeModal: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    color: "#000",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalMessage: {
    color: "#666",
    fontSize: 14,
    marginBottom: 16,
  },
  passcodeInput: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: "#000",
    marginBottom: 8,
  },
  passcodeError: {
    color: "#DC143C",
    fontSize: 13,
    marginBottom: 8,
  },
});

import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stitch } from "../../constants/theme";

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.backBtn}
        >
          <MaterialIcons name="chevron-left" size={26} color="#fff" />
        </Pressable>
        <Text style={styles.h1}>Política de privacidad</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.p}>
          En Planta de Transformación respetamos tu privacidad y protegemos tu
          información personal. Esta política describe qué datos recopilamos,
          cómo los utilizamos y cuáles son tus derechos.
        </Text>

        <Text style={styles.h2}>1. Datos que recopilamos</Text>

        <Text style={styles.p}>
          • Nombre y correo electrónico al crear una cuenta.
        </Text>
        <Text style={styles.p}>
          • Contraseña (almacenada de forma segura en el servidor).
        </Text>
        <Text style={styles.p}>
          • Rol de usuario (usuario o administrador).
        </Text>
        <Text style={styles.p}>
          • Contenido guardado y preferencias almacenadas en tu dispositivo.
        </Text>
        <Text style={styles.p}>
          • Imagen de perfil, si decides añadirla (guardada localmente).
        </Text>

        <Text style={styles.h2}>2. Finalidad del tratamiento</Text>

        <Text style={styles.p}>Utilizamos tu información para:</Text>
        <Text style={styles.p}>• Permitir autenticación y acceso seguro.</Text>
        <Text style={styles.p}>
          • Personalizar la experiencia dentro de la aplicación.
        </Text>
        <Text style={styles.p}>• Gestionar funcionalidades según tu rol.</Text>
        <Text style={styles.p}>
          • Garantizar el correcto funcionamiento del servicio.
        </Text>

        <Text style={styles.h2}>3. Almacenamiento de datos</Text>

        <Text style={styles.p}>
          • Los datos de cuenta se almacenan en un servidor seguro.
        </Text>
        <Text style={styles.p}>
          • El contenido guardado y algunos datos de sesión se almacenan
          localmente en tu dispositivo.
        </Text>

        <Text style={styles.h2}>4. Compartición de información</Text>

        <Text style={styles.p}>
          No vendemos, alquilamos ni compartimos tu información personal con
          terceros. Solo se utiliza para el funcionamiento interno de la
          aplicación.
        </Text>

        <Text style={styles.h2}>5. Conservación de datos</Text>

        <Text style={styles.p}>
          Tus datos se conservan mientras mantengas tu cuenta activa. Si
          eliminas tu cuenta, la información será removida del servidor y del
          almacenamiento local.
        </Text>

        <Text style={styles.h2}>6. Tus derechos</Text>

        <Text style={styles.p}>Tienes derecho a:</Text>
        <Text style={styles.p}>• Acceder a tu información personal.</Text>
        <Text style={styles.p}>• Corregir o actualizar tus datos.</Text>
        <Text style={styles.p}>• Eliminar tu cuenta en cualquier momento.</Text>

        <Text style={styles.p}>
          Puedes ejercer estos derechos desde la sección de perfil o utilizando
          la opción “Eliminar cuenta”.
        </Text>

        <Text style={styles.h2}>7. Cambios en esta política</Text>

        <Text style={styles.p}>
          Esta política puede actualizarse en caso de que se añadan nuevas
          funcionalidades o se modifique el tratamiento de datos. La fecha de
          actualización se indicará en esta sección.
        </Text>

        <Text style={[styles.p, { marginTop: 12 }]}>
          Última actualización: Febrero 2026
        </Text>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Stitch.colors.bg },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  h1: { flex: 1, color: "#fff", fontSize: 18, fontWeight: "900" },
  content: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 24 },
  h2: { color: "#fff", fontSize: 14, fontWeight: "900", marginTop: 14 },
  p: {
    color: "rgba(255,255,255,0.70)",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 20,
    marginTop: 8,
  },
});

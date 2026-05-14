import { useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { portfolioData } from "./src/constants/portfolioData";
import { createCvHtml } from "./src/utils/cvTemplate";

const DISPLAY_FONT = Platform.select({
  ios: "Avenir Next",
  android: "sans-serif-condensed",
  default: "System",
});

const BODY_FONT = Platform.select({
  ios: "Avenir",
  android: "sans-serif",
  default: "System",
});

const palette = {
  page: "#f3f6ee",
  ink: "#0f172a",
  muted: "#4b5563",
  line: "#d8e3d1",
  card: "#ffffff",
  heroStart: "#09101d",
  heroEnd: "#17423a",
  accent: "#c5f169",
  accentAlt: "#ffcb77",
  greenText: "#17372f",
};

const openExternalLink = async (url) => {
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  }
};

export default function App() {
  const [isExporting, setIsExporting] = useState(false);
  const { width } = useWindowDimensions();
  const isWide = width >= 920;

  const onDownloadCv = async () => {
    if (isExporting) {
      return;
    }

    setIsExporting(true);

    try {
      const html = createCvHtml(portfolioData);

      if (Platform.OS === "web") {
        const blob = new Blob([html], {
          type: "text/html;charset=utf-8",
        });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");

        anchor.href = url;
        anchor.download = "YeNaing_Modern_CV.html";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(url);
      } else {
        const { uri } = await Print.printToFileAsync({ html });
        const canShare = await Sharing.isAvailableAsync();

        if (canShare) {
          await Sharing.shareAsync(uri, {
            UTI: ".pdf",
            mimeType: "application/pdf",
            dialogTitle: "Download Ye Naing CV",
          });
        } else {
          await Share.share({
            title: "Ye Naing CV",
            message: uri,
            url: uri,
          });
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to export the CV.";

      if (Platform.OS === "web") {
        window.alert(message);
      } else {
        Alert.alert("Export failed", message);
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient colors={[palette.heroStart, palette.heroEnd]} style={styles.hero}>
          <View style={styles.orbOne} />
          <View style={styles.orbTwo} />

          <Text style={styles.kicker}>Portfolio / Resume</Text>
          <Text style={styles.heroTitle}>{portfolioData.profile.name}</Text>
          <Text style={styles.heroSubtitle}>
            {portfolioData.profile.title} based in {portfolioData.profile.location}
          </Text>
          <Text style={styles.heroSummary}>{portfolioData.profile.summary}</Text>
          <Text style={styles.heroFocus}>{portfolioData.profile.focus}</Text>

          <View style={styles.badgeRow}>
            {portfolioData.heroBadges.map((badge) => (
              <View key={badge} style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>{badge}</Text>
              </View>
            ))}
          </View>

          <View style={styles.ctaRow}>
            <PrimaryButton
              label={isExporting ? "Preparing CV..." : "Download CV"}
              onPress={onDownloadCv}
            />
            <SecondaryButton
              label="Email"
              onPress={() => openExternalLink(`mailto:${portfolioData.profile.email}`)}
            />
            <SecondaryButton
              label="Call"
              onPress={() => openExternalLink(`tel:${portfolioData.profile.phone}`)}
            />
          </View>
        </LinearGradient>

        <View style={[styles.statGrid, isWide && styles.statGridWide]}>
          {portfolioData.highlights.map((item) => (
            <Card key={item.label} style={styles.statCard}>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </Card>
          ))}
        </View>

        <Section
          title="Selected Work"
          description="A practical mix of enterprise backend systems, health reporting workflows, and production support."
        >
          <View style={[styles.projectGrid, isWide && styles.projectGridWide]}>
            {portfolioData.projects.map((project) => (
              <Card key={project.name} style={styles.projectCard}>
                <Text style={styles.cardEyebrow}>{project.stack}</Text>
                <Text style={styles.cardTitle}>{project.name}</Text>
                <Text style={styles.cardRole}>{project.role}</Text>
                <Text style={styles.cardBody}>{project.summary}</Text>
                <View style={styles.tagRow}>
                  {project.tags.map((tag) => (
                    <Tag key={tag} label={tag} />
                  ))}
                </View>
              </Card>
            ))}
          </View>
        </Section>

        <Section
          title="Experience"
          description="Recent roles focused on backend architecture, reporting systems, and reliable delivery under real business constraints."
        >
          <View style={styles.timeline}>
            {portfolioData.experience.map((job) => (
              <Card key={`${job.company}-${job.period}`} style={styles.timelineCard}>
                <View style={styles.timelineHeader}>
                  <View style={styles.timelineHeaderText}>
                    <Text style={styles.cardTitle}>{job.role}</Text>
                    <Text style={styles.timelineMeta}>
                      {job.company} · {job.location}
                    </Text>
                  </View>
                  <Text style={styles.timelinePeriod}>{job.period}</Text>
                </View>

                <Text style={styles.cardBody}>{job.summary}</Text>

                <View style={styles.bulletList}>
                  {job.bullets.map((bullet) => (
                    <View key={bullet} style={styles.bulletRow}>
                      <View style={styles.bulletDot} />
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              </Card>
            ))}
          </View>
        </Section>

        <View style={[styles.twoColumn, isWide && styles.twoColumnWide]}>
          <Section
            title="Core Strengths"
            description="The areas I use most often in production work."
            compact
          >
            <Card>
              <View style={styles.bulletList}>
                {portfolioData.strengths.map((strength) => (
                  <View key={strength} style={styles.bulletRow}>
                    <View style={[styles.bulletDot, styles.bulletDotAccent]} />
                    <Text style={styles.bulletText}>{strength}</Text>
                  </View>
                ))}
              </View>
            </Card>
          </Section>

          <Section
            title="Education"
            description="Academic background supporting software and systems work."
            compact
          >
            {portfolioData.education.map((item) => (
              <Card key={item.degree}>
                <Text style={styles.cardTitle}>{item.degree}</Text>
                <Text style={styles.cardBody}>{item.school}</Text>
                <Text style={styles.timelineMeta}>{item.meta}</Text>
              </Card>
            ))}
          </Section>
        </View>

        <Section
          title="Technology Stack"
          description="Grouped by the tools and environments used across recent projects."
        >
          <View style={[styles.skillGrid, isWide && styles.skillGridWide]}>
            {portfolioData.skillGroups.map((group) => (
              <Card key={group.title}>
                <Text style={styles.cardTitle}>{group.title}</Text>
                <View style={styles.tagRow}>
                  {group.items.map((item) => (
                    <Tag key={item} label={item} bright={group.title === "Backend"} />
                  ))}
                </View>
              </Card>
            ))}
          </View>
        </Section>

        <Card style={styles.contactCard}>
          <Text style={styles.contactTitle}>Let's build stable products that scale cleanly.</Text>
          <Text style={styles.contactBody}>
            For job opportunities or freelance work, reach me at {portfolioData.profile.email} or{" "}
            {portfolioData.profile.phone}.
          </Text>
          <View style={styles.contactActions}>
            <PrimaryButton
              label="Send Email"
              onPress={() => openExternalLink(`mailto:${portfolioData.profile.email}`)}
            />
            <SecondaryButton
              label="Download CV"
              onPress={onDownloadCv}
            />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, description, children, compact = false }) {
  return (
    <View style={[styles.section, compact && styles.sectionCompact]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionDescription}>{description}</Text>
      </View>
      {children}
    </View>
  );
}

function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

function Tag({ label, bright = false }) {
  return (
    <View style={[styles.tag, bright && styles.tagBright]}>
      <Text style={[styles.tagLabel, bright && styles.tagLabelBright]}>{label}</Text>
    </View>
  );
}

function PrimaryButton({ label, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

function SecondaryButton({ label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
    >
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.page,
  },
  scrollView: {
    flex: 1,
    backgroundColor: palette.page,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  hero: {
    margin: 20,
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 22,
    borderRadius: 32,
    overflow: "hidden",
  },
  orbOne: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    top: -80,
    right: -40,
    backgroundColor: "rgba(197, 241, 105, 0.16)",
  },
  orbTwo: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    bottom: -70,
    left: -60,
    backgroundColor: "rgba(255, 203, 119, 0.12)",
  },
  kicker: {
    color: "rgba(248, 250, 252, 0.72)",
    fontSize: 12,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    fontFamily: BODY_FONT,
  },
  heroTitle: {
    marginTop: 14,
    color: "#f8fafc",
    fontSize: 42,
    lineHeight: 44,
    letterSpacing: -1.6,
    fontWeight: "700",
    fontFamily: DISPLAY_FONT,
  },
  heroSubtitle: {
    marginTop: 10,
    color: "#d9f7ea",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600",
    fontFamily: BODY_FONT,
  },
  heroSummary: {
    marginTop: 18,
    color: "rgba(248, 250, 252, 0.88)",
    fontSize: 15,
    lineHeight: 24,
    fontFamily: BODY_FONT,
  },
  heroFocus: {
    marginTop: 10,
    color: "rgba(248, 250, 252, 0.74)",
    fontSize: 14,
    lineHeight: 22,
    fontFamily: BODY_FONT,
  },
  badgeRow: {
    marginTop: 22,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  heroBadge: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  heroBadgeText: {
    color: "#f8fafc",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
    fontFamily: BODY_FONT,
  },
  ctaRow: {
    marginTop: 24,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  primaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: palette.accent,
  },
  primaryButtonText: {
    color: palette.greenText,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.2,
    fontFamily: BODY_FONT,
  },
  secondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.14)",
  },
  secondaryButtonText: {
    color: "#f8fafc",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: BODY_FONT,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  statGrid: {
    paddingHorizontal: 20,
    gap: 12,
  },
  statGridWide: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  statCard: {
    minWidth: 150,
  },
  statValue: {
    color: palette.ink,
    fontSize: 30,
    lineHeight: 32,
    fontWeight: "800",
    letterSpacing: -1,
    fontFamily: DISPLAY_FONT,
  },
  statLabel: {
    marginTop: 8,
    color: palette.muted,
    fontSize: 13,
    fontFamily: BODY_FONT,
  },
  section: {
    marginTop: 28,
    paddingHorizontal: 20,
  },
  sectionCompact: {
    flex: 1,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    color: "#184b3d",
    fontSize: 12,
    letterSpacing: 2.2,
    textTransform: "uppercase",
    fontWeight: "800",
    fontFamily: BODY_FONT,
  },
  sectionDescription: {
    marginTop: 8,
    color: palette.muted,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: BODY_FONT,
  },
  card: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.line,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  projectGrid: {
    gap: 12,
  },
  projectGridWide: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  projectCard: {
    flexBasis: "48%",
    flexGrow: 1,
  },
  cardEyebrow: {
    color: "#1f6c58",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    fontFamily: BODY_FONT,
  },
  cardTitle: {
    marginTop: 10,
    color: palette.ink,
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: -0.6,
    fontWeight: "700",
    fontFamily: DISPLAY_FONT,
  },
  cardRole: {
    marginTop: 6,
    color: "#3f6b61",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    fontFamily: BODY_FONT,
  },
  cardBody: {
    marginTop: 10,
    color: palette.muted,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: BODY_FONT,
  },
  tagRow: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "#f3f6eb",
    borderWidth: 1,
    borderColor: "#e0e8d7",
  },
  tagBright: {
    backgroundColor: "#eaf7c8",
    borderColor: "#d7ec9f",
  },
  tagLabel: {
    color: "#425248",
    fontSize: 12,
    fontWeight: "700",
    fontFamily: BODY_FONT,
  },
  tagLabelBright: {
    color: "#1f422f",
  },
  timeline: {
    gap: 12,
  },
  timelineCard: {
    paddingTop: 20,
  },
  timelineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  timelineHeaderText: {
    flex: 1,
  },
  timelineMeta: {
    marginTop: 6,
    color: "#3f6b61",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    fontFamily: BODY_FONT,
  },
  timelinePeriod: {
    color: palette.ink,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    fontFamily: BODY_FONT,
  },
  bulletList: {
    marginTop: 14,
    gap: 12,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  bulletDot: {
    width: 9,
    height: 9,
    borderRadius: 99,
    marginTop: 7,
    backgroundColor: "#8ea7a0",
  },
  bulletDotAccent: {
    backgroundColor: palette.accentAlt,
  },
  bulletText: {
    flex: 1,
    color: palette.muted,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: BODY_FONT,
  },
  twoColumn: {
    gap: 0,
  },
  twoColumnWide: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  skillGrid: {
    gap: 12,
  },
  skillGridWide: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  contactCard: {
    marginTop: 28,
    marginHorizontal: 20,
    backgroundColor: "#edf6de",
    borderColor: "#d9e7b8",
  },
  contactTitle: {
    color: palette.ink,
    fontSize: 28,
    lineHeight: 31,
    letterSpacing: -0.8,
    fontWeight: "700",
    fontFamily: DISPLAY_FONT,
  },
  contactBody: {
    marginTop: 10,
    color: palette.greenText,
    fontSize: 15,
    lineHeight: 23,
    fontFamily: BODY_FONT,
  },
  contactActions: {
    marginTop: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
});

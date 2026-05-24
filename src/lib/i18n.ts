// Global, dependency-free i18n. Translations are flat key/value maps.
// Components read with useLang() — re-renders on language change.

import { useEffect, useState } from "react";

export type Lang = "en" | "fr";

export const STR = {
  // Welcome
  welcome_tag: { en: "Pay. Save. Learn. Build your financial identity — every transaction grows your Trust Score.", fr: "Payez. Épargnez. Apprenez. Construisez votre identité financière — chaque transaction augmente votre Score de Confiance." },
  get_started: { en: "Get Started", fr: "Commencer" },
  have_account: { en: "I already have an account", fr: "J'ai déjà un compte" },

  // Auth shared
  sign_up: { en: "Sign up", fr: "S'inscrire" },
  sign_in: { en: "Sign in", fr: "Se connecter" },
  continue: { en: "Continue", fr: "Continuer" },
  cancel: { en: "Cancel", fr: "Annuler" },
  back: { en: "Back", fr: "Retour" },
  next: { en: "Next", fr: "Suivant" },
  skip: { en: "Skip for now", fr: "Passer pour l'instant" },
  save_continue: { en: "Save & continue", fr: "Enregistrer & continuer" },
  submit: { en: "Submit", fr: "Soumettre" },
  verify: { en: "Verify", fr: "Vérifier" },
  resend: { en: "Didn't get it? Resend", fr: "Non reçu ? Renvoyer" },
  terms_note: { en: "By continuing you accept Eduvest's Terms & Privacy Policy.", fr: "En continuant vous acceptez les Conditions & la Politique de confidentialité d'Eduvest." },

  // Auth steps
  step: { en: "Step", fr: "Étape" },
  s_identity: { en: "Identity", fr: "Identité" },
  s_phone: { en: "Phone", fr: "Téléphone" },
  s_email: { en: "Email", fr: "Email" },
  s_pin: { en: "PIN", fr: "Code PIN" },

  identity_title: { en: "Tell us who you are", fr: "Dites-nous qui vous êtes" },
  identity_desc: { en: "Use the exact names on your ID card. These will pre-fill your KYC.", fr: "Utilisez les noms exacts de votre pièce d'identité. Ils pré-rempliront votre KYC." },
  first_name: { en: "First name", fr: "Prénom" },
  last_name: { en: "Last name", fr: "Nom" },
  country: { en: "Country", fr: "Pays" },
  region: { en: "Region / State", fr: "Région / État" },
  city: { en: "City", fr: "Ville" },

  phone_title: { en: "Your mobile number", fr: "Votre numéro de mobile" },
  phone_desc: { en: "We use it to sign you in and confirm payments.", fr: "Nous l'utilisons pour vous connecter et confirmer vos paiements." },
  phone_label: { en: "Phone number", fr: "Numéro de téléphone" },
  primary_pay_title: { en: "Use this number as my primary payment number", fr: "Utiliser ce numéro comme numéro de paiement principal" },
  primary_pay_desc: { en: "MoMo / Orange deposits & withdrawals will default to this number.", fr: "Les dépôts/retraits MoMo / Orange utiliseront ce numéro par défaut." },
  send_otp: { en: "Send OTP", fr: "Envoyer le code OTP" },
  otp_channel: { en: "Receive OTP via", fr: "Recevoir l'OTP par" },
  whatsapp: { en: "WhatsApp", fr: "WhatsApp" },
  whatsapp_hint: { en: "Free if you have data", fr: "Gratuit avec internet" },
  sms: { en: "SMS", fr: "SMS" },
  sms_hint: { en: "Works without internet", fr: "Fonctionne sans internet" },

  otp_title: { en: "Enter the 4-digit OTP", fr: "Entrez le code OTP à 4 chiffres" },
  otp_sent_via: { en: "Sent to", fr: "Envoyé à" },
  otp_demo: { en: "Demo code", fr: "Code démo" },
  otp_wrong: { en: "Wrong OTP. Demo code is 1234", fr: "Mauvais OTP. Le code démo est 1234" },

  email_title: { en: "Email & username", fr: "Email & nom d'utilisateur" },
  email_desc: { en: "Email is required for receipts & recovery. You can verify it later.", fr: "L'email est requis pour les reçus et la récupération. Vous pourrez le vérifier plus tard." },
  email: { en: "Email", fr: "Email" },
  username: { en: "Username", fr: "Nom d'utilisateur" },
  username_hint: { en: "How others see you when receiving money.", fr: "Comment les autres vous voient en recevant de l'argent." },
  verify_now: { en: "Verify email now", fr: "Vérifier l'email maintenant" },
  verify_later: { en: "Skip — we'll remind you in your Profile.", fr: "Passer — nous vous rappellerons dans le Profil." },

  pin_title: { en: "Create your 4-digit PIN", fr: "Créez votre PIN à 4 chiffres" },
  pin_desc: { en: "Used to authorise every payment. Don't share it.", fr: "Utilisé pour autoriser chaque paiement. Ne le partagez pas." },
  pin_confirm_title: { en: "Confirm your PIN", fr: "Confirmez votre PIN" },
  pin_confirm_desc: { en: "Re-enter the same 4-digit PIN.", fr: "Saisissez à nouveau le même PIN à 4 chiffres." },
  create_account: { en: "Create account", fr: "Créer un compte" },
  account_created: { en: "Account created", fr: "Compte créé" },

  // Onboarding
  setup_title: { en: "Set up your account", fr: "Configurer votre compte" },
  setup_subtitle: { en: "Takes ~3 minutes", fr: "Environ 3 minutes" },
  i_am: { en: "I am a…", fr: "Je suis…" },
  i_am_desc: { en: "We tailor your experience to your role.", fr: "Nous adaptons votre expérience à votre rôle." },
  r_parent: { en: "Parent", fr: "Parent" },
  r_parent_d: { en: "Pay fees, track attendance, save for kids.", fr: "Payer les frais, suivre la présence, épargner pour vos enfants." },
  r_student: { en: "Student", fr: "Étudiant" },
  r_student_d: { en: "Pay tuition, save pocket money, book tutors.", fr: "Payer les frais, épargner, réserver des tuteurs." },
  r_teacher: { en: "Teacher", fr: "Enseignant" },
  r_teacher_d: { en: "Offer private lessons & receive payments.", fr: "Donner des cours privés & recevoir des paiements." },
  r_sme: { en: "Business / SME / Employee", fr: "Entreprise / PME / Employé" },
  r_sme_d: { en: "Payroll, supplier payments, salary advances, SME loans.", fr: "Paie, paiements fournisseurs, avances sur salaire, prêts PME." },

  // Teacher (4 UIs)
  teach_step1: { en: "Subject & levels", fr: "Matière & niveaux" },
  teach_step2: { en: "Mode & location", fr: "Mode & localisation" },
  teach_step3: { en: "Pricing & payment", fr: "Tarif & paiement" },
  teach_step4: { en: "Profile & bio", fr: "Profil & bio" },
  teach_boost: { en: "Boost your income 💰", fr: "Boostez vos revenus 💰" },
  teach_boost_d: { en: "Fill your lesson profile — parents are already browsing Eduvest for verified tutors.", fr: "Complétez votre profil — des parents recherchent déjà des tuteurs vérifiés." },
  t_subject: { en: "Subject", fr: "Matière" },
  t_levels: { en: "Levels you teach", fr: "Niveaux que vous enseignez" },
  t_exams: { en: "Exams (optional)", fr: "Examens (optionnel)" },
  t_modes: { en: "Teaching mode", fr: "Mode d'enseignement" },
  t_quarter: { en: "Quarter", fr: "Quartier" },
  t_rate: { en: "Rate per hour (FCFA)", fr: "Tarif par heure (FCFA)" },
  t_monthly: { en: "Monthly (optional)", fr: "Mensuel (optionnel)" },
  t_pay_timings: { en: "Payment timing", fr: "Calendrier de paiement" },
  t_bio: { en: "Short bio", fr: "Courte bio" },
  t_saved: { en: "Lesson profile saved", fr: "Profil de cours enregistré" },

  // KYC
  kyc_intro_title: { en: "Let's verify your identity", fr: "Vérifions votre identité" },
  kyc_intro_desc: { en: "Regulators require us to know who you are before you move money. Verification protects your wallet from fraud and unlocks every Eduvest feature.", fr: "La réglementation exige que nous vous identifiions avant tout mouvement d'argent. La vérification protège votre portefeuille et débloque toutes les fonctionnalités." },
  kyc_prepare: { en: "Prepare these documents to snap:", fr: "Préparez ces documents à scanner :" },
  kyc_prep_id: { en: "Your National ID — front and back, OR Passport / Residence permit", fr: "Votre Carte nationale — recto et verso, OU Passeport / Permis de séjour" },
  kyc_prep_selfie: { en: "A clear selfie (good lighting, no cap or sunglasses)", fr: "Un selfie net (bonne lumière, sans casquette ni lunettes)" },
  kyc_prep_sme: { en: "Business docs: registration certificate + Taxpayer card", fr: "Documents entreprise : registre de commerce + Carte de contribuable" },
  kyc_tip: { en: "Tip: clean the camera lens and place the ID on a dark, flat surface.", fr: "Astuce : nettoyez l'objectif et posez la pièce sur une surface plate et sombre." },
  kyc_without: { en: "What you can do without KYC", fr: "Ce que vous pouvez faire sans KYC" },
  kyc_yes: { en: "✓ Deposit / Top up · ✓ Save · ✓ Receive money", fr: "✓ Dépôt / Recharge · ✓ Épargne · ✓ Recevoir de l'argent" },
  kyc_no: { en: "✗ Send money · ✗ Withdraw", fr: "✗ Envoyer · ✗ Retirer" },
  im_ready: { en: "I'm ready", fr: "Je suis prêt(e)" },

  kyc_s1: { en: "Personal info", fr: "Infos personnelles" },
  kyc_s2: { en: "Document", fr: "Document" },
  kyc_s3: { en: "Biometric", fr: "Biométrie" },
  kyc_s4: { en: "Business", fr: "Entreprise" },

  k_personal_title: { en: "Confirm your personal info", fr: "Confirmez vos infos personnelles" },
  k_full_name: { en: "Full name (as on ID)", fr: "Nom complet (selon la pièce)" },
  k_gender: { en: "Gender", fr: "Sexe" },
  k_male: { en: "Male", fr: "Masculin" },
  k_female: { en: "Female", fr: "Féminin" },
  k_dob: { en: "Date of birth", fr: "Date de naissance" },
  k_citizenship: { en: "Citizenship", fr: "Citoyenneté" },
  k_resident: { en: "Country of residence", fr: "Pays de résidence" },

  k_doc_title: { en: "Identity document", fr: "Pièce d'identité" },
  k_doc_type: { en: "Document type", fr: "Type de document" },
  k_doc_num: { en: "Document number", fr: "Numéro de la pièce" },
  k_front: { en: "Front", fr: "Recto" },
  k_back: { en: "Back", fr: "Verso" },
  k_selfie: { en: "Selfie", fr: "Selfie" },

  k_bio_title: { en: "Biometric verification", fr: "Vérification biométrique" },
  k_bio_desc: { en: "Snap a quick selfie. We match it to your ID. Optionally enable fingerprint / Face ID to unlock the app.", fr: "Prenez un selfie. Nous le comparons à votre pièce. Activez optionnellement l'empreinte / Face ID pour déverrouiller l'app." },
  k_bio_enable: { en: "Enable biometric (fingerprint / Face ID)", fr: "Activer la biométrie (empreinte / Face ID)" },
  k_bio_enable_d: { en: "Used to unlock the app and approve big payments.", fr: "Utilisé pour déverrouiller l'app et autoriser les gros paiements." },

  k_biz_title: { en: "Business verification (optional)", fr: "Vérification entreprise (optionnel)" },
  k_biz_desc: { en: "Only required to run payroll or access SME loans.", fr: "Requis uniquement pour la paie ou les prêts PME." },
  k_biz_name: { en: "Business / School name", fr: "Nom de l'entreprise / école" },
  k_biz_reg: { en: "Registration number", fr: "Numéro d'enregistrement" },
  k_biz_tax: { en: "Taxpayer card number", fr: "Numéro de carte contribuable" },
  k_biz_addr: { en: "Business address", fr: "Adresse de l'entreprise" },
  k_done_title: { en: "You're all set!", fr: "Tout est prêt !" },
  k_done_desc: { en: "Welcome to Eduvest. Start exploring your home screen.", fr: "Bienvenue sur Eduvest. Découvrez votre écran d'accueil." },
  go_home: { en: "Go to home", fr: "Aller à l'accueil" },

  // Home
  welcome_back: { en: "Welcome back,", fr: "Bon retour," },
  view_balance: { en: "View Balance", fr: "Voir le solde" },
  quick_actions: { en: "Quick Actions", fr: "Actions rapides" },
  services: { en: "Services", fr: "Services" },
  see_all: { en: "See all", fr: "Voir tout" },
  community: { en: "Eduvest Community", fr: "Communauté Eduvest" },
  community_d: { en: "Connect everyone in the ecosystem", fr: "Connectez tout l'écosystème" },
  trust_score: { en: "Your Trust Score", fr: "Votre Score de Confiance" },
  trust_score_d: { en: "Every payment builds your financial identity.", fr: "Chaque paiement construit votre identité financière." },

  // BottomNav
  nav_home: { en: "Home", fr: "Accueil" },
  nav_attendance: { en: "Attendance", fr: "Présence" },
  nav_pay: { en: "Pay", fr: "Payer" },
  nav_insurance: { en: "Insurance", fr: "Assurance" },
  nav_profile: { en: "Profile", fr: "Profil" },

  // Errors
  err_required: { en: "Please fill all required fields", fr: "Veuillez remplir tous les champs requis" },
  err_phone: { en: "Enter a valid 9-digit number", fr: "Entrez un numéro valide à 9 chiffres" },
  err_email: { en: "Invalid email", fr: "Email invalide" },
  err_pin_len: { en: "PIN must be 4 digits", fr: "Le PIN doit comporter 4 chiffres" },
  err_pin_match: { en: "PINs don't match", fr: "Les PIN ne correspondent pas" },
  ok_otp_sent: { en: "OTP sent", fr: "OTP envoyé" },
  ok_resent: { en: "OTP resent", fr: "OTP renvoyé" },
} as const;

export type StrKey = keyof typeof STR;

const KEY = "lang";
export const getLang = (): Lang => (localStorage.getItem(KEY) as Lang) || "en";
export const setLang = (l: Lang) => {
  localStorage.setItem(KEY, l);
  document.documentElement.lang = l;
  window.dispatchEvent(new CustomEvent("eduvest:lang", { detail: l }));
};
export const toggleLang = () => setLang(getLang() === "en" ? "fr" : "en");

export const useLang = () => {
  const [lang, setL] = useState<Lang>(getLang());
  useEffect(() => {
    const on = (e: Event) => setL((e as CustomEvent).detail as Lang);
    window.addEventListener("eduvest:lang", on);
    return () => window.removeEventListener("eduvest:lang", on);
  }, []);
  const t = (k: StrKey) => STR[k][lang];
  return { lang, t, setLang, toggle: toggleLang };
};

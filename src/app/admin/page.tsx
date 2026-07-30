"use client";

import React, { useState, useEffect } from "react";
import { useData, Project, Testimonial, Enquiry } from "@/context/DataContext";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPage() {
  const {
    projects,
    testimonials,
    enquiries,
    settings,
    highlightedVideo,
    addProject,
    editProject,
    deleteProject,
    addTestimonial,
    editTestimonial,
    deleteTestimonial,
    deleteEnquiry,
    updateSettings,
    updateHighlightedVideo,
  } = useData();

  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Credentials editing state
  const [credentialsModalOpen, setCredentialsModalOpen] = useState(false);
  const [credForm, setCredForm] = useState({
    username: settings.adminUsername,
    password: settings.adminPassword,
  });

  // Navigation state
  const [activeTab, setActiveTab] = useState<"dashboard" | "projects" | "testimonials" | "enquiries" | "settings">("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Search & Filter state
  const [projectSearch, setProjectSearch] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] = useState("All");
  const [projectFeaturedFilter, setProjectFeaturedFilter] = useState("All");

  const [testimonialSearch, setTestimonialSearch] = useState("");
  const [enquirySearch, setEnquirySearch] = useState("");

  // CRUD Forms State
  const [projectModal, setProjectModal] = useState<{ open: boolean; mode: "add" | "edit"; data?: Project }>({ open: false, mode: "add" });
  const [projectForm, setProjectForm] = useState<{
    title: string;
    bhk: string;
    location: string;
    status: "Available" | "Booked" | "Delivered";
    imageSrc: string;
    showOnHomepage: boolean;
    projectOverview: string;
    brochure: { fileUrl: string; publicId: string; fileType: string } | null;
    locationData: { address: string; place: string; latitude: string | number; longitude: string | number };
    projectGallery: { imageUrl: string; publicId: string }[];
  }>({
    title: "",
    bhk: "4 BHK",
    location: "",
    status: "Available",
    imageSrc: "/assets/placeholder-house.png",
    showOnHomepage: true,
    projectOverview: "",
    brochure: null,
    locationData: { address: "", place: "", latitude: "", longitude: "" },
    projectGallery: [],
  });

  // Uploading progress states
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>({});

  const [testimonialModal, setTestimonialModal] = useState<{ open: boolean; mode: "add" | "edit"; data?: Testimonial }>({ open: false, mode: "add" });
  const [testimonialForm, setTestimonialForm] = useState<{
    content: string;
    name: string;
    designation: string;
    image: { imageUrl: string; publicId: string } | null;
  }>({
    content: "",
    name: "",
    designation: "",
    image: null,
  });

  const [settingsForm, setSettingsForm] = useState({
    companyName: settings.companyName,
    phone: settings.phone,
    email: settings.email,
    address: settings.address,
    instagram: settings.instagram || "",
    twitter: settings.twitter || "",
    facebook: settings.facebook || "",
    youtube: settings.youtube || "",
    linkedin: settings.linkedin || "",
  });

  // Sync settings when loaded
  useEffect(() => {
    setSettingsForm({
      companyName: settings.companyName,
      phone: settings.phone,
      email: settings.email,
      address: settings.address,
      instagram: settings.instagram || "",
      twitter: settings.twitter || "",
      facebook: settings.facebook || "",
      youtube: settings.youtube || "",
      linkedin: settings.linkedin || "",
    });
    setCredForm({
      username: settings.adminUsername,
      password: settings.adminPassword,
    });
  }, [settings]);

  // Load login state from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = sessionStorage.getItem("pd_admin_logged_in") === "true";
      setIsLoggedIn(loggedIn);
    }
    setIsMounted(true);
  }, []);

  // Drawer / Details Modal State
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; type: "project" | "testimonial" | "enquiry"; id: number } | null>(null);

  // Toast notification state
  const [toasts, setToasts] = useState<{ id: number; message: string; type: "success" | "error" }[]>([]);

  const triggerToast = (message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Cloudinary File Upload via XHR (to track progress)
  const uploadFile = (file: File, key: string): Promise<{ url: string; publicId: string; fileType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        if (typeof base64 !== "string") {
          reject(new Error("File conversion failed"));
          return;
        }

        setIsUploading(prev => ({ ...prev, [key]: true }));
        setUploadProgress(prev => ({ ...prev, [key]: 0 }));

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/upload", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(prev => ({ ...prev, [key]: percent }));
          }
        };

        xhr.onload = () => {
          setIsUploading(prev => ({ ...prev, [key]: false }));
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);
              resolve(res);
            } catch (err) {
              reject(err);
            }
          } else {
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => {
          setIsUploading(prev => ({ ...prev, [key]: false }));
          reject(new Error("Upload error"));
        };

        xhr.send(JSON.stringify({ file: base64 }));
      };
      reader.readAsDataURL(file);
    });
  };

  // Stats
  const totalProjectsCount = projects.length;
  const availableCount = projects.filter((p) => p.status === "Available").length;
  const bookedCount = projects.filter((p) => p.status === "Booked").length;
  const deliveredCount = projects.filter((p) => p.status === "Delivered").length;
  const totalTestimonialsCount = testimonials.length;
  const totalEnquiriesCount = enquiries.length;

  // Filtered Lists
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(projectSearch.toLowerCase()) || p.location.toLowerCase().includes(projectSearch.toLowerCase());
    const matchesStatus = projectStatusFilter === "All" || p.status === projectStatusFilter;
    const matchesFeatured = projectFeaturedFilter === "All" || 
      (projectFeaturedFilter === "Featured" && p.showOnHomepage) ||
      (projectFeaturedFilter === "Not Featured" && !p.showOnHomepage);
    return matchesSearch && matchesStatus && matchesFeatured;
  });

  const filteredTestimonials = testimonials.filter((t) => 
    t.name.toLowerCase().includes(testimonialSearch.toLowerCase())
  );

  const filteredEnquiries = enquiries.filter((e) => 
    e.name.toLowerCase().includes(enquirySearch.toLowerCase()) || 
    e.email.toLowerCase().includes(enquirySearch.toLowerCase())
  );

  // Handle Project Form Actions
  const handleOpenAddProject = () => {
    setProjectForm({
      title: "",
      bhk: "4 BHK",
      location: "",
      status: "Available",
      imageSrc: "/assets/placeholder-house.png",
      showOnHomepage: true,
      projectOverview: "",
      brochure: null,
      locationData: { address: "", place: "", latitude: "", longitude: "" },
      projectGallery: [],
    });
    setProjectModal({ open: true, mode: "add" });
  };

  const handleOpenEditProject = (p: Project) => {
    setProjectForm({
      title: p.title,
      bhk: p.bhk,
      location: p.location,
      status: p.status,
      imageSrc: p.imageSrc,
      showOnHomepage: p.showOnHomepage,
      projectOverview: p.projectOverview || "",
      brochure: p.brochure || null,
      locationData: {
        address: p.locationData?.address || p.location || "",
        place: p.locationData?.place || p.location || "",
        latitude: p.locationData?.latitude || "",
        longitude: p.locationData?.longitude || "",
      },
      projectGallery: p.projectGallery || (p as any).gallery || [],
    });
    setProjectModal({ open: true, mode: "edit", data: p });
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title.trim() || !projectForm.locationData.place.trim() || !projectForm.locationData.address.trim()) {
      triggerToast("Please fill out Name, Place, and Address.", "error");
      return;
    }

    if (!projectForm.projectOverview.trim()) {
      triggerToast("Please provide a Project Overview.", "error");
      return;
    }

    const projectPayload = {
      ...projectForm,
      projectOverview: projectForm.projectOverview.trim(),
      location: projectForm.locationData.place,
    };

    if (projectModal.mode === "add") {
      addProject(projectPayload);
      triggerToast("Project added successfully!");
    } else if (projectModal.mode === "edit" && projectModal.data) {
      editProject({ ...projectPayload, id: projectModal.data.id });
      triggerToast("Project updated successfully!");
    }
    setProjectModal({ open: false, mode: "add" });
  };

  // Handle Testimonial Form Actions
  const handleOpenAddTestimonial = () => {
    setTestimonialForm({ content: "", name: "", designation: "", image: null });
    setTestimonialModal({ open: true, mode: "add" });
  };

  const handleOpenEditTestimonial = (t: Testimonial) => {
    setTestimonialForm({ content: t.content, name: t.name, designation: t.designation, image: t.image || null });
    setTestimonialModal({ open: true, mode: "edit", data: t });
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialForm.content.trim() || !testimonialForm.name.trim()) {
      triggerToast("Please fill out Name and Content fields.", "error");
      return;
    }

    if (testimonialModal.mode === "add") {
      addTestimonial({
        ...testimonialForm,
        glowBig: "bg-[#7DD3FC]",
        glowSmall: "bg-[#38BDF8]",
      });
      triggerToast("Testimonial added successfully!");
    } else if (testimonialModal.mode === "edit" && testimonialModal.data) {
      editTestimonial({
        ...testimonialModal.data,
        ...testimonialForm,
      });
      triggerToast("Testimonial updated successfully!");
    }
    setTestimonialModal({ open: false, mode: "add" });
  };

  // Handle Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm.companyName.trim() || !settingsForm.email.trim() || !settingsForm.phone.trim() || !settingsForm.address.trim()) {
      triggerToast("All settings fields are required.", "error");
      return;
    }
    updateSettings({
      ...settings,
      ...settingsForm,
    });
    triggerToast("Settings saved successfully!");
  };

  // Handle Highlighted Video Upload/Replace/Delete
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadFile(file, "highlighted_video");
      await updateHighlightedVideo({
        videoUrl: res.url,
        publicId: res.publicId,
      });
      triggerToast("Video uploaded and updated successfully!");
    } catch (err) {
      triggerToast("Video upload failed.", "error");
    }
  };

  const handleRemoveVideo = async () => {
    try {
      await updateHighlightedVideo(null);
      triggerToast("Highlighted video removed successfully!");
    } catch (err) {
      triggerToast("Failed to remove video.", "error");
    }
  };

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername === settings.adminUsername && loginPassword === settings.adminPassword) {
      sessionStorage.setItem("pd_admin_logged_in", "true");
      setIsLoggedIn(true);
      setAuthError("");
      triggerToast("Logged in successfully!");
    } else {
      setAuthError("Invalid username or password.");
      triggerToast("Invalid credentials", "error");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.removeItem("pd_admin_logged_in");
    setIsLoggedIn(false);
    setLoginUsername("");
    setLoginPassword("");
    triggerToast("Logged out successfully.");
  };

  // Handle Save Credentials
  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credForm.username.trim() || !credForm.password.trim()) {
      triggerToast("Username and password cannot be empty.", "error");
      return;
    }
    updateSettings({
      ...settings,
      adminUsername: credForm.username,
      adminPassword: credForm.password,
    });
    setCredentialsModalOpen(false);
    triggerToast("Credentials updated successfully!");
  };

  // Handle Delete Confirmation
  const confirmDelete = () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;

    if (type === "project") {
      deleteProject(id);
      triggerToast("Project deleted successfully.");
    } else if (type === "testimonial") {
      deleteTestimonial(id);
      triggerToast("Testimonial deleted successfully.");
    } else if (type === "enquiry") {
      deleteEnquiry(id);
      triggerToast("Enquiry deleted successfully.");
    }
    setDeleteConfirm(null);
  };

  const menuItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: "lucide:layout-dashboard" },
    { id: "projects" as const, label: "Projects", icon: "lucide:home" },
    { id: "testimonials" as const, label: "Testimonials", icon: "lucide:message-square" },
    { id: "enquiries" as const, label: "Enquiries", icon: "lucide:mail" },
    { id: "settings" as const, label: "Settings", icon: "lucide:settings" },
  ];

  if (!isMounted) {
    return <div className="min-h-screen bg-[#F8FAFC]" />;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0B1117] flex items-center justify-center p-6 relative overflow-hidden font-sans antialiased">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#38BDF8]/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-900/20 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-[#161F2C]/80 border border-[#232F3F] backdrop-blur-md rounded-[32px] p-8 md:p-10 shadow-2xl relative z-10 flex flex-col gap-8">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white shadow-inner">
              <img src="/assets/logowhite.png" alt="PD Logo" className="w-[32px] h-[32px] object-contain" />
            </div>
            <h2 className="font-serif text-[24px] text-white uppercase tracking-wider mt-2">
              PD Construction
            </h2>
            <p className="text-[13px] text-[#8E9CAE]">
              Enter admin panel credentials to proceed
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {authError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 text-xs text-red-400 font-medium flex items-center gap-2">
                <Icon icon="lucide:alert-circle" width="16" height="16" className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-[#C6CDDB]">Username</label>
              <div className="relative">
                <Icon icon="lucide:user" className="absolute left-4 top-[17px] text-[#64748B]" width="18" height="18" />
                <input 
                  type="text" 
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full bg-[#0B1117] border border-[#232F3F] rounded-xl h-[52px] pl-12 pr-4 text-sm text-white placeholder-[#64748B] outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-[#C6CDDB]">Password</label>
              <div className="relative">
                <Icon icon="lucide:lock" className="absolute left-4 top-[17px] text-[#64748B]" width="18" height="18" />
                <input 
                  type="password" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0B1117] border border-[#232F3F] rounded-xl h-[52px] pl-12 pr-4 text-sm text-white placeholder-[#64748B] outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full h-[52px] bg-white text-[#0B1117] hover:bg-[#F1F5F9] transition-all rounded-xl text-sm font-semibold cursor-pointer shadow-md flex items-center justify-center gap-2 mt-2"
            >
              <span>Login to Panel</span>
              <Icon icon="lucide:arrow-right" width="16" height="16" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#0B1117] font-sans antialiased overflow-hidden">
      
      {/* Toast Notification Container */}
      <div className="fixed top-8 right-8 z-[200] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-medium ${
                t.type === "success" 
                  ? "bg-white border-green-200 text-green-700 shadow-green-100" 
                  : "bg-white border-red-200 text-red-700 shadow-red-100"
              }`}
            >
              <Icon 
                icon={t.type === "success" ? "lucide:check-circle" : "lucide:alert-circle"} 
                className={t.type === "success" ? "text-green-600" : "text-red-600"}
                width="20" 
                height="20" 
              />
              <span>{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sidebar - Desktop */}
      <div 
        className={`hidden lg:flex flex-col bg-[#0B1117] text-[#C6CDDB] border-r border-[#1A232E] transition-all duration-300 h-screen sticky top-0 ${
          sidebarOpen ? "w-[260px]" : "w-[80px]"
        } shrink-0`}
      >
        <div className="h-[88px] flex items-center px-6 border-b border-[#1A232E] justify-between overflow-hidden">
          <div className="flex items-center gap-[12px] text-white">
            <img src="/assets/logowhite.png" alt="PD Logo" className="w-[28px] h-[28px] object-contain shrink-0" />
            <span className={`font-serif text-[18px] tracking-wide whitespace-nowrap transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 w-0 pointer-events-none"}`}>
              {settings.companyName}
            </span>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[#C6CDDB] hover:text-white transition-colors"
          >
            <Icon icon={sidebarOpen ? "lucide:chevron-left" : "lucide:chevron-right"} width="20" height="20" />
          </button>
        </div>

        <nav className="flex-grow py-8 px-4 flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  active 
                    ? "bg-white/10 text-white shadow-sm" 
                    : "hover:bg-white/5 text-[#C6CDDB] hover:text-white"
                }`}
              >
                <Icon icon={item.icon} width="20" height="20" className="shrink-0" />
                <span className={`transition-opacity duration-300 whitespace-nowrap ${sidebarOpen ? "opacity-100" : "opacity-0 w-0 pointer-events-none"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-[#1A232E] shrink-0">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-500/10 text-[#C6CDDB] hover:text-red-400 transition-all text-sm font-medium cursor-pointer"
          >
            <Icon icon="lucide:log-out" width="20" height="20" className="shrink-0" />
            <span className={`transition-opacity duration-300 whitespace-nowrap ${sidebarOpen ? "opacity-100" : "opacity-0 w-0 pointer-events-none"}`}>
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black z-[120] lg:hidden"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ ease: "easeInOut", duration: 0.3 }}
              className="fixed top-0 bottom-0 left-0 w-[280px] bg-[#0B1117] text-[#C6CDDB] z-[130] flex flex-col border-r border-[#1A232E] lg:hidden"
            >
              <div className="h-[88px] flex items-center px-6 border-b border-[#1A232E] justify-between">
                <div className="flex items-center gap-[12px] text-white">
                  <img src="/assets/logowhite.png" alt="PD Logo" className="w-[28px] h-[28px] object-contain shrink-0" />
                  <span className="font-serif text-[18px] tracking-wide">{settings.companyName}</span>
                </div>
                <button onClick={() => setMobileSidebarOpen(false)} className="text-white">
                  <Icon icon="lucide:x" width="24" height="24" />
                </button>
              </div>
              <nav className="flex-grow py-8 px-4 flex flex-col gap-1.5">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium ${
                      activeTab === item.id 
                        ? "bg-white/10 text-white" 
                        : "hover:bg-white/5 text-[#C6CDDB]"
                    }`}
                  >
                    <Icon icon={item.icon} width="20" height="20" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
              
              <div className="p-4 border-t border-[#1A232E] shrink-0">
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-red-500/10 text-[#C6CDDB] hover:text-red-400 transition-all text-sm font-medium cursor-pointer"
                >
                  <Icon icon="lucide:log-out" width="20" height="20" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Work Area */}
      <div className="flex-grow flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="sticky top-0 z-[50] h-[88px] border-b border-[#E2E8F0] bg-white flex items-center justify-between px-6 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[#0B1117] hover:bg-[#F1F5F9] rounded-lg transition-colors"
            >
              <Icon icon="lucide:menu" width="24" height="24" />
            </button>
            <h1 className="font-serif text-[22px] md:text-[24px] uppercase tracking-wide">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[12px] font-sans font-medium text-[#64748B] tracking-wide uppercase">Connected</span>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-grow p-6 md:p-8 max-w-[1600px] w-full mx-auto">
          {activeTab === "dashboard" && (
            <div className="flex flex-col gap-8">
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                {[
                  { label: "Total Projects", value: totalProjectsCount, icon: "lucide:folder", bg: "bg-[#F8FAFC]", text: "text-[#0B1117]" },
                  { label: "Available", value: availableCount, icon: "lucide:check-circle", bg: "bg-green-50/50 border-green-100", text: "text-green-700" },
                  { label: "Booked", value: bookedCount, icon: "lucide:calendar", bg: "bg-yellow-50/50 border-yellow-100", text: "text-yellow-700" },
                  { label: "Delivered", value: deliveredCount, icon: "lucide:check", bg: "bg-blue-50/50 border-blue-100", text: "text-blue-700" },
                  { label: "Testimonials", value: totalTestimonialsCount, icon: "lucide:message-square", bg: "bg-[#F8FAFC]", text: "text-[#0B1117]" },
                  { label: "Enquiries", value: totalEnquiriesCount, icon: "lucide:mail", bg: "bg-[#F8FAFC]", text: "text-[#0B1117]" },
                ].map((s, idx) => (
                  <div key={idx} className={`p-5 rounded-2xl border border-[#E2E8F0] ${s.bg} flex flex-col justify-between h-[120px]`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-medium text-[#64748B] tracking-wider uppercase">{s.label}</span>
                      <Icon icon={s.icon} width="18" height="18" className="text-[#64748B]" />
                    </div>
                    <span className={`text-3xl font-serif font-bold ${s.text}`}>{s.value}</span>
                  </div>
                ))}
              </div>

              {/* Dashboard Layout Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Recent Projects */}
                <div className="lg:col-span-7 bg-white rounded-[24px] border border-[#E2E8F0] p-6 flex flex-col gap-6">
                  <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-4">
                    <h3 className="font-serif text-[18px] uppercase tracking-wider">Recent Projects</h3>
                    <button onClick={() => setActiveTab("projects")} className="text-[13px] text-[#0B1117] font-semibold hover:underline">View All</button>
                  </div>
                  {projects.length === 0 ? (
                    <div className="py-12 text-center text-[#64748B]">No projects recorded.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[14px]">
                        <thead>
                          <tr className="border-b border-[#F1F5F9] text-[#64748B] font-medium">
                            <th className="pb-3">Project Name</th>
                            <th className="pb-3">BHK</th>
                            <th className="pb-3">Location</th>
                            <th className="pb-3">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects.slice(0, 5).map((project) => (
                             <tr key={project.id} className="border-b border-[#F8FAFC] last:border-0 hover:bg-[#F8FAFC] transition-colors">
                              <td className="py-3.5 font-medium">{project.title}</td>
                              <td className="py-3.5 text-[#64748B]">{project.bhk}</td>
                              <td className="py-3.5 text-[#64748B]">{project.locationData?.address || project.location}</td>
                              <td className="py-3.5">
                                <span className={`inline-flex px-2.5 py-1 rounded-full text-[12px] font-medium ${
                                  project.status === "Available" 
                                    ? "bg-green-100 text-green-800" 
                                    : project.status === "Booked" 
                                      ? "bg-yellow-100 text-yellow-800" 
                                      : "bg-blue-100 text-blue-800"
                                }`}>
                                  {project.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Recent Enquiries */}
                <div className="lg:col-span-5 bg-white rounded-[24px] border border-[#E2E8F0] p-6 flex flex-col gap-6">
                  <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-4">
                    <h3 className="font-serif text-[18px] uppercase tracking-wider">Recent Enquiries</h3>
                    <button onClick={() => setActiveTab("enquiries")} className="text-[13px] text-[#0B1117] font-semibold hover:underline">View All</button>
                  </div>
                  {enquiries.length === 0 ? (
                    <div className="py-12 text-center text-[#64748B] text-sm">No client enquiries received.</div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {enquiries.slice(0, 4).map((enq) => (
                        <div 
                          key={enq.id}
                          onClick={() => setSelectedEnquiry(enq)}
                          className="p-4 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-all border border-[#E2E8F0]/30 cursor-pointer flex flex-col gap-2"
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-sm text-[#0B1117]">{enq.name}</span>
                            <span className="text-[11px] text-[#8E9CAE]">{enq.date}</span>
                          </div>
                          <p className="text-[13px] text-[#64748B] font-medium leading-none">{enq.subject}</p>
                          <p className="text-[13px] text-[#64748B] line-clamp-1">{enq.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="flex flex-col gap-8">
              
              {/* Toolbar */}
              <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                
                {/* Search / Filters */}
                <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                  <div className="relative w-full md:w-[260px]">
                    <Icon icon="lucide:search" className="absolute left-3.5 top-3.5 text-[#8E9CAE]" width="18" height="18" />
                    <input 
                      type="text" 
                      placeholder="Search projects..." 
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl h-[46px] pl-11 pr-4 text-sm text-[#1A1F2A] placeholder-[#8E9CAE] focus:outline-none focus:border-[#0B1117] focus:ring-1 focus:ring-[#0B1117]/10 transition-all"
                    />
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <select 
                      value={projectStatusFilter}
                      onChange={(e) => setProjectStatusFilter(e.target.value)}
                      className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl h-[46px] px-4 text-sm text-[#1A1F2A] focus:outline-none focus:border-[#0B1117] transition-all shrink-0"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Available">Available</option>
                      <option value="Booked">Booked</option>
                      <option value="Delivered">Delivered</option>
                    </select>

                    <select 
                      value={projectFeaturedFilter}
                      onChange={(e) => setProjectFeaturedFilter(e.target.value)}
                      className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl h-[46px] px-4 text-sm text-[#1A1F2A] focus:outline-none focus:border-[#0B1117] transition-all shrink-0"
                    >
                      <option value="All">All Showcases</option>
                      <option value="Featured">Homepage Featured</option>
                      <option value="Not Featured">Not Featured</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={handleOpenAddProject}
                  className="w-full md:w-auto h-[46px] px-6 bg-[#0B1117] text-white hover:bg-[#1A1F2A] transition-colors rounded-xl flex items-center justify-center gap-2 text-sm font-medium cursor-pointer shadow-sm shrink-0"
                >
                  <Icon icon="lucide:plus" width="18" height="18" />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Projects Grid/Table */}
              <div className="bg-white rounded-[24px] border border-[#E2E8F0] overflow-hidden">
                {filteredProjects.length === 0 ? (
                  <div className="py-24 text-center text-[#64748B] flex flex-col items-center justify-center gap-3">
                    <Icon icon="lucide:folder-open" width="48" height="48" className="text-[#8E9CAE]" />
                    <span>No projects found. Add your first villa.</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[14px]">
                      <thead>
                        <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] font-semibold">
                          <th className="py-4 px-6 w-[100px]">Image</th>
                          <th className="py-4 px-6">Project Name</th>
                          <th className="py-4 px-6">BHK</th>
                          <th className="py-4 px-6">Location Address</th>
                          <th className="py-4 px-6">Status</th>
                          <th className="py-4 px-6">Homepage Showcase</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProjects.map((project) => (
                          <tr key={project.id} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-all">
                            <td className="py-4 px-6">
                              <div className="w-[64px] h-[48px] rounded-lg overflow-hidden border border-[#E2E8F0] bg-neutral-100 shrink-0">
                                <img src={project.imageSrc} alt={project.title} className="w-full h-full object-cover" />
                              </div>
                            </td>
                            <td className="py-4 px-6 font-semibold text-[#0B1117] text-base">{project.title}</td>
                            <td className="py-4 px-6 text-[#64748B]">{project.bhk}</td>
                            <td className="py-4 px-6 text-[#64748B]">{project.locationData?.address || project.location}</td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex px-3 py-1 rounded-full text-[12px] font-semibold ${
                                project.status === "Available" 
                                  ? "bg-green-100 text-green-800" 
                                  : project.status === "Booked" 
                                    ? "bg-yellow-100 text-yellow-800" 
                                    : "bg-blue-100 text-blue-800"
                              }`}>
                                {project.status}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex px-3 py-1 rounded-full text-[12px] font-semibold ${
                                project.showOnHomepage 
                                  ? "bg-violet-100 text-violet-800" 
                                  : "bg-neutral-100 text-neutral-800"
                              }`}>
                                {project.showOnHomepage ? "Featured" : "Not Featured"}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => handleOpenEditProject(project)}
                                  className="p-2 border border-[#E2E8F0] rounded-lg text-[#64748B] hover:text-[#0B1117] hover:bg-[#F8FAFC] transition-colors"
                                >
                                  <Icon icon="lucide:edit-2" width="16" height="16" />
                                </button>
                                <button 
                                  onClick={() => setDeleteConfirm({ open: true, type: "project", id: project.id })}
                                  className="p-2 border border-red-100 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  <Icon icon="lucide:trash-2" width="16" height="16" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "testimonials" && (
            <div className="flex flex-col gap-8">
              
              <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-[260px]">
                  <Icon icon="lucide:search" className="absolute left-3.5 top-3.5 text-[#8E9CAE]" width="18" height="18" />
                  <input 
                    type="text" 
                    placeholder="Search testimonials..." 
                    value={testimonialSearch}
                    onChange={(e) => setTestimonialSearch(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl h-[46px] pl-11 pr-4 text-sm text-[#1A1F2A] placeholder-[#8E9CAE] focus:outline-none focus:border-[#0B1117] transition-all"
                  />
                </div>
                <button 
                  onClick={handleOpenAddTestimonial}
                  className="w-full md:w-auto h-[46px] px-6 bg-[#0B1117] text-white hover:bg-[#1A1F2A] transition-colors rounded-xl flex items-center justify-center gap-2 text-sm font-medium cursor-pointer shadow-sm shrink-0"
                >
                  <Icon icon="lucide:plus" width="18" height="18" />
                  <span>Add Testimonial</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTestimonials.map((t) => (
                  <div key={t.id} className="bg-white border border-[#E2E8F0] rounded-3xl p-6 flex flex-col gap-4 justify-between shadow-sm relative group overflow-hidden">
                    <p className="text-sm text-[#64748B] italic leading-relaxed line-clamp-4">"{t.content}"</p>
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#F1F5F9]">
                      {t.image?.imageUrl ? (
                        <img src={t.image.imageUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-[#E2E8F0]" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#0B1117] text-white flex items-center justify-center text-xs font-serif uppercase">
                          {t.name.split(" ").filter(Boolean).map(n => n[0]).join("").substring(0, 2) || "U"}
                        </div>
                      )}
                      <div>
                        <h4 className="font-serif text-sm font-bold text-[#0B1117] uppercase tracking-wider">{t.name}</h4>
                        {t.designation && <p className="text-[11px] text-[#64748B]">{t.designation}</p>}
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenEditTestimonial(t)}
                        className="p-1.5 bg-white border border-[#E2E8F0] rounded-lg text-[#64748B] hover:text-[#0B1117] transition-colors shadow-sm"
                      >
                        <Icon icon="lucide:edit-2" width="14" height="14" />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm({ open: true, type: "testimonial", id: t.id })}
                        className="p-1.5 bg-white border border-red-100 rounded-lg text-red-600 hover:bg-red-50 transition-colors shadow-sm"
                      >
                        <Icon icon="lucide:trash-2" width="14" height="14" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "enquiries" && (
            <div className="bg-white rounded-[24px] border border-[#E2E8F0] overflow-hidden">
              <div className="p-4 border-b border-[#E2E8F0]">
                <div className="relative w-[280px]">
                  <Icon icon="lucide:search" className="absolute left-3.5 top-3.5 text-[#8E9CAE]" width="18" height="18" />
                  <input 
                    type="text" 
                    placeholder="Search client name/email..." 
                    value={enquirySearch}
                    onChange={(e) => setEnquirySearch(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl h-[46px] pl-11 pr-4 text-sm text-[#1A1F2A] focus:outline-none focus:border-[#0B1117]"
                  />
                </div>
              </div>
              
              {filteredEnquiries.length === 0 ? (
                <div className="py-24 text-center text-[#64748B]">No enquiries found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[14px]">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] font-semibold">
                        <th className="py-4 px-6">Client Name</th>
                        <th className="py-4 px-6">Email</th>
                        <th className="py-4 px-6">Subject</th>
                        <th className="py-4 px-6">Date</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEnquiries.map((enq) => (
                        <tr 
                          key={enq.id} 
                          onClick={() => setSelectedEnquiry(enq)}
                          className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-all cursor-pointer"
                        >
                          <td className="py-4 px-6 font-medium text-[#0B1117]">{enq.name}</td>
                          <td className="py-4 px-6 text-[#64748B]">{enq.email}</td>
                          <td className="py-4 px-6 text-[#64748B] font-medium">{enq.subject}</td>
                          <td className="py-4 px-6 text-[#8E9CAE]">{enq.date}</td>
                          <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => setDeleteConfirm({ open: true, type: "enquiry", id: enq.id })}
                              className="p-2 border border-red-100 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Icon icon="lucide:trash-2" width="16" height="16" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column - General Info Form */}
              <form onSubmit={handleSaveSettings} className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-[24px] p-6 md:p-8 flex flex-col gap-6">
                <h3 className="font-serif text-[18px] uppercase tracking-wide border-b border-[#F1F5F9] pb-4">Company Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#1A1F2A]">Company Name</label>
                    <input 
                      type="text" 
                      value={settingsForm.companyName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, companyName: e.target.value })}
                      className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl h-[46px] px-4 text-sm text-[#1A1F2A] outline-none focus:border-[#0B1117]"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#1A1F2A]">Phone Number</label>
                    <input 
                      type="text" 
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl h-[46px] px-4 text-sm text-[#1A1F2A] outline-none focus:border-[#0B1117]"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-[#1A1F2A]">Email Address</label>
                    <input 
                      type="email" 
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl h-[46px] px-4 text-sm text-[#1A1F2A] outline-none focus:border-[#0B1117]"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-[#1A1F2A]">Address</label>
                    <textarea 
                      rows={3}
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 text-sm text-[#1A1F2A] outline-none focus:border-[#0B1117] resize-none"
                      required
                    />
                  </div>
                </div>

                <h3 className="font-serif text-[18px] uppercase tracking-wide border-b border-[#F1F5F9] pb-4 mt-4">Social Accounts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#1A1F2A]">Instagram</label>
                    <input 
                      type="text" 
                      value={settingsForm.instagram}
                      onChange={(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value })}
                      className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl h-[46px] px-4 text-sm text-[#1A1F2A] outline-none focus:border-[#0B1117]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#1A1F2A]">Twitter</label>
                    <input 
                      type="text" 
                      value={settingsForm.twitter}
                      onChange={(e) => setSettingsForm({ ...settingsForm, twitter: e.target.value })}
                      className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl h-[46px] px-4 text-sm text-[#1A1F2A] outline-none focus:border-[#0B1117]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#1A1F2A]">Facebook</label>
                    <input 
                      type="text" 
                      value={settingsForm.facebook}
                      onChange={(e) => setSettingsForm({ ...settingsForm, facebook: e.target.value })}
                      className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl h-[46px] px-4 text-sm text-[#1A1F2A] outline-none focus:border-[#0B1117]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#1A1F2A]">YouTube</label>
                    <input 
                      type="text" 
                      value={settingsForm.youtube}
                      onChange={(e) => setSettingsForm({ ...settingsForm, youtube: e.target.value })}
                      className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl h-[46px] px-4 text-sm text-[#1A1F2A] outline-none focus:border-[#0B1117]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#1A1F2A]">LinkedIn</label>
                    <input 
                      type="text" 
                      value={settingsForm.linkedin}
                      onChange={(e) => setSettingsForm({ ...settingsForm, linkedin: e.target.value })}
                      className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl h-[46px] px-4 text-sm text-[#1A1F2A] outline-none focus:border-[#0B1117]"
                    />
                  </div>
                </div>

                <button type="submit" className="h-[48px] bg-[#0B1117] hover:bg-[#1A1F2A] text-white rounded-xl text-sm font-semibold transition-colors mt-4">
                  Save Changes
                </button>
              </form>

              {/* Right Column - Highlighted Video & Admin Credentials */}
              <div className="lg:col-span-5 flex flex-col gap-8">
                
                {/* Highlighted Video Upload Section */}
                <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 flex flex-col gap-5">
                  <h3 className="font-serif text-[18px] uppercase tracking-wide border-b border-[#F1F5F9] pb-4">Highlighted Video</h3>
                  
                  {highlightedVideo?.videoUrl ? (
                    <div className="flex flex-col gap-4">
                      <div className="aspect-video rounded-xl overflow-hidden bg-neutral-900 border border-[#E2E8F0] relative group">
                        <video 
                          src={highlightedVideo.videoUrl} 
                          controls 
                          muted 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <label className="flex-grow h-[42px] border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-lg text-xs font-semibold text-[#64748B] flex items-center justify-center gap-2 cursor-pointer transition-colors">
                          <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} disabled={isUploading["highlighted_video"]} />
                          <Icon icon="lucide:refresh-cw" width="14" height="14" />
                          <span>Replace Video</span>
                        </label>
                        <button 
                          onClick={handleRemoveVideo}
                          className="px-4 h-[42px] bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Icon icon="lucide:trash-2" width="14" height="14" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-[180px] border-2 border-dashed border-[#CBD5E1] hover:border-[#0B1117] rounded-xl cursor-pointer bg-[#F8FAFC] transition-colors relative overflow-hidden group">
                      <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} disabled={isUploading["highlighted_video"]} />
                      <div className="flex flex-col items-center gap-1 text-[#64748B] group-hover:text-[#0B1117] transition-colors">
                        {isUploading["highlighted_video"] ? (
                          <>
                            <Icon icon="line-md:loading-twotone-loop" width="28" height="28" className="text-[#0B1117]" />
                            <span className="text-xs font-medium text-[#0B1117]">Uploading Video ({uploadProgress["highlighted_video"] || 0}%)</span>
                          </>
                        ) : (
                          <>
                            <Icon icon="lucide:video" width="28" height="28" />
                            <span className="text-xs font-semibold">Upload Highlighted Video</span>
                            <span className="text-[10px] text-[#8E9CAE]">MP4, WebM up to 50MB</span>
                          </>
                        )}
                      </div>
                    </label>
                  )}
                </div>

                {/* Credentials Section */}
                <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 flex flex-col gap-4">
                  <h3 className="font-serif text-[18px] uppercase tracking-wide border-b border-[#F1F5F9] pb-4">Admin Credentials</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">Change username and password to secure the portal.</p>
                  <button 
                    onClick={() => {
                      setCredForm({ username: settings.adminUsername, password: settings.adminPassword });
                      setCredentialsModalOpen(true);
                    }}
                    className="h-[46px] border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-xl text-sm font-semibold text-[#0B1117] transition-colors"
                  >
                    Edit Credentials
                  </button>
                </div>

              </div>
            </div>
          )}
        </main>
      </div>

      {/* --- ADD / EDIT PROJECT DIALOG --- */}
      {projectModal.open && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setProjectModal({ open: false, mode: "add" })} />
          
          <div className="relative bg-white rounded-[28px] shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row z-10 border border-[#E2E8F0]">
            
            {/* Form Column */}
            <form onSubmit={handleSaveProject} className="flex-grow p-6 md:p-8 overflow-y-auto flex flex-col gap-6 md:max-w-xl">
              <div className="flex justify-between items-start border-b border-[#F1F5F9] pb-4">
                <h3 className="font-serif text-[20px] uppercase tracking-wide">
                  {projectModal.mode === "add" ? "Add New Project" : "Edit Project"}
                </h3>
                <button type="button" onClick={() => setProjectModal({ open: false, mode: "add" })} className="text-[#64748B] hover:text-[#0B1117]">
                  <Icon icon="lucide:x" width="20" height="20" />
                </button>
              </div>

              {/* Title */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#1A1F2A]">Project Name*</label>
                <input 
                  type="text" 
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="e.g. VILLA BREEZE"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl h-[48px] px-4 text-sm text-[#1A1F2A] focus:outline-none focus:border-[#0B1117]"
                  required
                />
              </div>

              {/* BHK */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#1A1F2A]">BHK Configuration*</label>
                <select 
                  value={projectForm.bhk}
                  onChange={(e) => setProjectForm({ ...projectForm, bhk: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl h-[48px] px-4 text-sm text-[#1A1F2A]"
                >
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="4 BHK">4 BHK</option>
                  <option value="5 BHK">5 BHK Configuration</option>
                </select>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#1A1F2A]">Purchase Status*</label>
                <select 
                  value={projectForm.status}
                  onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as any })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl h-[48px] px-4 text-sm text-[#1A1F2A]"
                >
                  <option value="Available">Available</option>
                  <option value="Booked">Booked</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              {/* Project Overview */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-[14px] font-medium text-[#1A1F2A]">Project Overview*</label>
                  <span className="text-[11px] text-[#64748B] font-medium">
                    {projectForm.projectOverview.length} characters
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={projectForm.projectOverview}
                  onChange={(e) => setProjectForm({ ...projectForm, projectOverview: e.target.value })}
                  placeholder="Describe the project... Mention the concept, architecture, amenities, quality, location benefits, construction standards, lifestyle, etc."
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#0B1117] rounded-xl p-4 text-sm text-[#1A1F2A] outline-none transition-all resize-y leading-relaxed placeholder:text-[#94A3B8]"
                  required
                />
              </div>

              {/* Location Fields */}
              <div className="flex flex-col gap-3 bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                <span className="text-[13px] font-bold uppercase text-[#64748B] tracking-wider">Project Location & Mapping</span>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-[#1A1F2A]">Place* (Shown on project card, e.g. Valasaravakkam)</label>
                  <input 
                    type="text" 
                    value={projectForm.locationData.place}
                    onChange={(e) => setProjectForm({ ...projectForm, locationData: { ...projectForm.locationData, place: e.target.value } })}
                    placeholder="e.g. Valasaravakkam"
                    className="bg-white border border-[#E2E8F0] rounded-xl h-[42px] px-3 text-sm text-[#1A1F2A] outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-[#1A1F2A]">Site address* (Used for map search)</label>
                  <input 
                    type="text" 
                    value={projectForm.locationData.address}
                    onChange={(e) => setProjectForm({ ...projectForm, locationData: { ...projectForm.locationData, address: e.target.value } })}
                    placeholder="e.g. Valasaravakkam, Chennai"
                    className="bg-white border border-[#E2E8F0] rounded-xl h-[42px] px-3 text-sm text-[#1A1F2A] outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#1A1F2A]">Latitude (Optional)</label>
                    <input 
                      type="text" 
                      value={projectForm.locationData.latitude}
                      onChange={(e) => setProjectForm({ ...projectForm, locationData: { ...projectForm.locationData, latitude: e.target.value } })}
                      placeholder="e.g. 13.0402"
                      className="bg-white border border-[#E2E8F0] rounded-xl h-[42px] px-3 text-sm text-[#1A1F2A]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#1A1F2A]">Longitude (Optional)</label>
                    <input 
                      type="text" 
                      value={projectForm.locationData.longitude}
                      onChange={(e) => setProjectForm({ ...projectForm, locationData: { ...projectForm.locationData, longitude: e.target.value } })}
                      placeholder="e.g. 80.1712"
                      className="bg-white border border-[#E2E8F0] rounded-xl h-[42px] px-3 text-sm text-[#1A1F2A]"
                    />
                  </div>
                </div>
              </div>
              {/* Main Image Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#1A1F2A]">Upload Project Image*</label>
                <div className="flex items-center gap-4">
                  <label className="flex flex-col items-center justify-center flex-1 h-[100px] border-2 border-dashed border-[#CBD5E1] hover:border-[#0B1117] rounded-xl cursor-pointer bg-[#F8FAFC] transition-colors relative overflow-hidden group">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      disabled={isUploading["project_image"]}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const res = await uploadFile(file, "project_image");
                            setProjectForm(prev => ({ ...prev, imageSrc: res.url }));
                            triggerToast("Main image uploaded!");
                          } catch (err) {
                            triggerToast("Image upload failed.", "error");
                          }
                        }
                      }}
                    />
                    <div className="flex flex-col items-center gap-1 text-[#64748B] group-hover:text-[#0B1117] transition-colors">
                      {isUploading["project_image"] ? (
                        <>
                          <Icon icon="line-md:loading-twotone-loop" width="24" height="24" className="text-[#0B1117]" />
                          <span className="text-[12px] font-medium text-[#0B1117]">Uploading ({uploadProgress["project_image"] || 0}%)</span>
                        </>
                      ) : (
                        <>
                          <Icon icon="lucide:upload-cloud" width="24" height="24" />
                          <span className="text-[12px] font-medium">Click to upload image</span>
                        </>
                      )}
                    </div>
                  </label>
                  
                  {projectForm.imageSrc && (
                    <div className="w-[100px] h-[100px] rounded-xl border border-[#E2E8F0] overflow-hidden shrink-0 relative group bg-neutral-100">
                      <img src={projectForm.imageSrc} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button"
                          onClick={() => setProjectForm((prev) => ({ ...prev, imageSrc: "/assets/placeholder-house.png" }))}
                          className="p-1.5 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors"
                          title="Remove image"
                        >
                          <Icon icon="lucide:trash-2" width="14" height="14" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Brochure File Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#1A1F2A]">Upload Project Brochure (PDF / DOCX)</label>
                <div className="flex items-center gap-4">
                  <label className="flex flex-col items-center justify-center flex-1 h-[90px] border-2 border-dashed border-[#CBD5E1] hover:border-[#0B1117] rounded-xl cursor-pointer bg-[#F8FAFC] transition-colors relative overflow-hidden group">
                    <input 
                      type="file" 
                      accept=".pdf,.docx" 
                      className="hidden" 
                      disabled={isUploading["brochure"]}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const res = await uploadFile(file, "brochure");
                            setProjectForm(prev => ({
                              ...prev,
                              brochure: {
                                fileUrl: res.url,
                                publicId: res.publicId,
                                fileType: res.fileType,
                              }
                            }));
                            triggerToast("Brochure uploaded!");
                          } catch (err) {
                            triggerToast("Brochure upload failed.", "error");
                          }
                        }
                      }}
                    />
                    <div className="flex flex-col items-center gap-1 text-[#64748B] group-hover:text-[#0B1117] transition-colors">
                      {isUploading["brochure"] ? (
                        <>
                          <Icon icon="line-md:loading-twotone-loop" width="20" height="20" className="text-[#0B1117]" />
                          <span className="text-[12px] font-medium text-[#0B1117]">Uploading ({uploadProgress["brochure"] || 0}%)</span>
                        </>
                      ) : (
                        <>
                          <Icon icon="lucide:file-text" width="20" height="20" />
                          <span className="text-[12px] font-medium">Click to upload document</span>
                        </>
                      )}
                    </div>
                  </label>
                  
                  {projectForm.brochure?.fileUrl && (
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-3 rounded-xl flex items-center justify-between gap-4 max-w-[200px] shrink-0 relative group">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Icon icon="lucide:file-text" width="20" height="20" className="text-red-500 shrink-0" />
                        <span className="text-[12px] text-[#0B1117] font-medium truncate">Brochure Loaded</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setProjectForm(prev => ({ ...prev, brochure: null }))}
                        className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                        title="Remove brochure"
                      >
                        <Icon icon="lucide:trash-2" width="14" height="14" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Gallery */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-[14px] font-medium text-[#1A1F2A]">Project Gallery ({projectForm.projectGallery?.length || 0}/10)</label>
                  <span className="text-[11px] text-[#64748B]">Max 10 JPG, PNG, or WEBP images</span>
                </div>
                
                {/* Drag and Drop Zone */}
                <label 
                  className="flex flex-col items-center justify-center h-[90px] border-2 border-dashed border-[#CBD5E1] hover:border-[#0B1117] rounded-xl cursor-pointer bg-[#F8FAFC] transition-colors relative overflow-hidden group"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={async (e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files || []);
                    if (files.length === 0) return;
                    
                    const currentCount = projectForm.projectGallery?.length || 0;
                    if (currentCount + files.length > 10) {
                      triggerToast("Maximum 10 images allowed in gallery.", "error");
                      return;
                    }
                    
                    for (let i = 0; i < files.length; i++) {
                      const file = files[i];
                      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
                        triggerToast(`File ${file.name} is not a valid format. Only JPG, PNG, and WEBP allowed.`, "error");
                        continue;
                      }
                      const uploadKey = `gallery_${Date.now()}_${i}`;
                      try {
                        const res = await uploadFile(file, uploadKey);
                        setProjectForm(prev => ({
                          ...prev,
                          projectGallery: [...(prev.projectGallery || []), { imageUrl: res.url, publicId: res.publicId }]
                        }));
                        triggerToast(`Uploaded ${file.name}`);
                      } catch (err) {
                        triggerToast(`Upload failed for ${file.name}`, "error");
                      }
                    }
                  }}
                >
                  <input 
                    type="file" 
                    multiple 
                    accept="image/jpeg,image/png,image/webp" 
                    className="hidden" 
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      const currentCount = projectForm.projectGallery?.length || 0;
                      if (currentCount + files.length > 10) {
                        triggerToast("Maximum 10 images allowed in gallery.", "error");
                        return;
                      }
                      
                      for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
                          triggerToast(`File ${file.name} is not a valid format. Only JPG, PNG, and WEBP allowed.`, "error");
                          continue;
                        }
                        const uploadKey = `gallery_${Date.now()}_${i}`;
                        try {
                          const res = await uploadFile(file, uploadKey);
                          setProjectForm(prev => ({
                            ...prev,
                            projectGallery: [...(prev.projectGallery || []), { imageUrl: res.url, publicId: res.publicId }]
                          }));
                          triggerToast(`Uploaded ${file.name}`);
                        } catch (err) {
                          triggerToast(`Upload failed for ${file.name}`, "error");
                        }
                      }
                    }}
                  />
                  <div className="flex flex-col items-center gap-1 text-[#64748B] group-hover:text-[#0B1117] transition-colors">
                    <Icon icon="lucide:image" width="20" height="20" />
                    <span className="text-[12px] font-medium">Click or Drag & Drop to upload gallery images</span>
                  </div>
                </label>

                {/* Gallery Thumbnail Grid */}
                {projectForm.projectGallery && projectForm.projectGallery.length > 0 && (
                  <div className="grid grid-cols-5 gap-3 mt-2">
                    {projectForm.projectGallery.map((item, index) => (
                      <div 
                        key={item.publicId || index}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", index.toString());
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
                          if (!isNaN(fromIndex) && fromIndex !== index) {
                            const updated = [...projectForm.projectGallery];
                            const [moved] = updated.splice(fromIndex, 1);
                            updated.splice(index, 0, moved);
                            setProjectForm(prev => ({ ...prev, projectGallery: updated }));
                          }
                        }}
                        className="group aspect-square rounded-xl border border-[#E2E8F0] overflow-hidden relative bg-neutral-100 cursor-move"
                      >
                        <img src={item.imageUrl} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                        
                        {/* Overlay Controls */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                          {/* Move Left */}
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...projectForm.projectGallery];
                                const [moved] = updated.splice(index, 1);
                                updated.splice(index - 1, 0, moved);
                                setProjectForm(prev => ({ ...prev, projectGallery: updated }));
                              }}
                              className="p-1 bg-white/20 hover:bg-white/40 text-white rounded transition-colors cursor-pointer"
                              title="Move Left"
                            >
                                <Icon icon="lucide:arrow-left" width="12" height="12" />
                            </button>
                          )}
                          
                          {/* Delete */}
                          <button
                            type="button"
                            onClick={async () => {
                              const updated = projectForm.projectGallery.filter((_, idx) => idx !== index);
                              setProjectForm(prev => ({ ...prev, projectGallery: updated }));
                              triggerToast("Gallery image removed.");
                              try {
                                await fetch("/api/upload", {
                                  method: "DELETE",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ publicId: item.publicId, resourceType: "image" }),
                                });
                              } catch (err) {
                                console.error("Cloudinary delete error:", err);
                              }
                            }}
                            className="p-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Icon icon="lucide:trash-2" width="12" height="12" />
                          </button>

                          {/* Move Right */}
                          {index < projectForm.projectGallery.length - 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...projectForm.projectGallery];
                                const [moved] = updated.splice(index, 1);
                                updated.splice(index + 1, 0, moved);
                                setProjectForm(prev => ({ ...prev, projectGallery: updated }));
                              }}
                              className="p-1 bg-white/20 hover:bg-white/40 text-white rounded transition-colors cursor-pointer"
                              title="Move Right"
                            >
                              <Icon icon="lucide:arrow-right" width="12" height="12" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Homepage visibility */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={projectForm.showOnHomepage}
                  onChange={(e) => setProjectForm({ ...projectForm, showOnHomepage: e.target.checked })}
                  className="w-5 h-5 rounded-lg border-[#CBD5E1] text-[#0B1117] focus:ring-[#0B1117]/10 transition-all cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[#1A1F2A]">Show on Homepage Showcase</span>
                  <span className="text-[11px] text-[#64748B]">If unchecked, this project will only show on the Works page.</span>
                </div>
              </label>

              {/* Submit Buttons */}
              <div className="flex gap-3 border-t border-[#F1F5F9] pt-5 mt-auto">
                <button type="submit" className="flex-grow h-[50px] bg-[#0B1117] hover:bg-[#1A1F2A] text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer">
                  Save Project
                </button>
                <button type="button" onClick={() => setProjectModal({ open: false, mode: "add" })} className="px-6 h-[50px] border border-[#CBD5E1] rounded-xl text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors">
                  Cancel
                </button>
              </div>
            </form>

            {/* Live Preview Column */}
            <div className="hidden md:flex flex-col bg-[#F8FAFC] border-l border-[#E2E8F0] w-[440px] p-8 shrink-0 justify-center">
              <div className="flex flex-col gap-4 mb-6">
                <h4 className="font-serif text-[13px] uppercase tracking-widest text-[#64748B]">Live Card Preview</h4>
                <p className="text-[12px] text-[#64748B] leading-snug">Exactly how this card appears on your homepage and portfolio grids.</p>
              </div>
              <div className="w-full">
                <ProjectCard 
                  title={projectForm.title || "PROJECT NAME"}
                  bhk={projectForm.bhk}
                  location={projectForm.locationData.address || "Location"}
                  status={projectForm.status}
                  imageSrc={projectForm.imageSrc}
                  brochure={projectForm.brochure}
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- ADD / EDIT TESTIMONIAL DIALOG --- */}
      {testimonialModal.open && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setTestimonialModal({ open: false, mode: "add" })} />
          
          <div className="relative bg-white rounded-[28px] shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row z-10 border border-[#E2E8F0]">
            
            {/* Form Column */}
            <form onSubmit={handleSaveTestimonial} className="flex-grow p-6 md:p-8 overflow-y-auto flex flex-col gap-6 md:max-w-xl">
              <div className="flex justify-between items-start border-b border-[#F1F5F9] pb-4">
                <h3 className="font-serif text-[20px] uppercase tracking-wide">
                  {testimonialModal.mode === "add" ? "Add Testimonial" : "Edit Testimonial"}
                </h3>
                <button type="button" onClick={() => setTestimonialModal({ open: false, mode: "add" })} className="text-[#64748B] hover:text-[#0B1117]">
                  <Icon icon="lucide:x" width="20" height="20" />
                </button>
              </div>

              {/* Client Name */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#1A1F2A]">Client Name*</label>
                <input 
                  type="text" 
                  value={testimonialForm.name}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                  placeholder="e.g. MR. SRINIVASAN"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl h-[48px] px-4 text-sm text-[#1A1F2A] focus:outline-none focus:border-[#0B1117]"
                  required
                />
              </div>

              {/* Designation */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#1A1F2A]">Designation / Affiliation</label>
                <input 
                  type="text" 
                  value={testimonialForm.designation}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, designation: e.target.value })}
                  placeholder="e.g. CEO (Smart learn academy)"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl h-[48px] px-4 text-sm text-[#1A1F2A] focus:outline-none focus:border-[#0B1117]"
                />
              </div>

              {/* Client Photo Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#1A1F2A]">Client Image (Optional)</label>
                <div className="flex items-center gap-4">
                  <label className="flex flex-col items-center justify-center flex-1 h-[90px] border-2 border-dashed border-[#CBD5E1] hover:border-[#0B1117] rounded-xl cursor-pointer bg-[#F8FAFC] transition-colors relative overflow-hidden group">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      disabled={isUploading["testimonial_photo"]}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const res = await uploadFile(file, "testimonial_photo");
                            setTestimonialForm(prev => ({
                              ...prev,
                              image: {
                                imageUrl: res.url,
                                publicId: res.publicId,
                              }
                            }));
                            triggerToast("Client photo uploaded!");
                          } catch (err) {
                            triggerToast("Photo upload failed.", "error");
                          }
                        }
                      }}
                    />
                    <div className="flex flex-col items-center gap-1 text-[#64748B] group-hover:text-[#0B1117] transition-colors">
                      {isUploading["testimonial_photo"] ? (
                        <>
                          <Icon icon="line-md:loading-twotone-loop" width="20" height="20" className="text-[#0B1117]" />
                          <span className="text-[12px] font-medium text-[#0B1117]">Uploading ({uploadProgress["testimonial_photo"] || 0}%)</span>
                        </>
                      ) : (
                        <>
                          <Icon icon="lucide:user" width="20" height="20" />
                          <span className="text-[12px] font-medium">Click to upload photo</span>
                        </>
                      )}
                    </div>
                  </label>
                  
                  {testimonialForm.image?.imageUrl && (
                    <div className="w-[80px] h-[80px] rounded-full border border-[#E2E8F0] overflow-hidden shrink-0 relative group bg-neutral-100">
                      <img src={testimonialForm.image.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                        <button 
                          type="button"
                          onClick={() => setTestimonialForm(prev => ({ ...prev, image: null }))}
                          className="p-1.5 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors"
                          title="Remove image"
                        >
                          <Icon icon="lucide:trash-2" width="14" height="14" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#1A1F2A]">Testimonial Message*</label>
                <textarea 
                  rows={5}
                  value={testimonialForm.content}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                  placeholder="Paste review message here..."
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 text-sm text-[#1A1F2A] outline-none focus:border-[#0B1117] resize-none"
                  required
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 border-t border-[#F1F5F9] pt-5 mt-auto">
                <button type="submit" className="flex-grow h-[50px] bg-[#0B1117] hover:bg-[#1A1F2A] text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer">
                  Save Testimonial
                </button>
                <button type="button" onClick={() => setTestimonialModal({ open: false, mode: "add" })} className="px-6 h-[50px] border border-[#CBD5E1] rounded-xl text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors">
                  Cancel
                </button>
              </div>
            </form>

            {/* Live Preview Column */}
            <div className="hidden md:flex flex-col bg-[#F8FAFC] border-l border-[#E2E8F0] w-[440px] p-8 shrink-0 justify-center overflow-hidden">
              <div className="flex flex-col gap-4 mb-6">
                <h4 className="font-serif text-[13px] uppercase tracking-widest text-[#64748B]">Live Testimonial Preview</h4>
                <p className="text-[12px] text-[#64748B] leading-snug">Renders exactly with your sliding testimonial carousel colors.</p>
              </div>
              <div className="w-full flex justify-center">
                <TestimonialCard 
                  content={testimonialForm.content || "Client review content will appear here..."}
                  name={testimonialForm.name || "CLIENT NAME"}
                  designation={testimonialForm.designation || "Designation"}
                  glowBig="bg-[#7DD3FC]"
                  glowSmall="bg-[#38BDF8]"
                  image={testimonialForm.image}
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- SIDE DRAWER: ENQUIRY VIEW --- */}
      <AnimatePresence>
        {selectedEnquiry && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEnquiry(null)}
              className="fixed inset-0 bg-black/50 z-[140] backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ ease: "easeInOut", duration: 0.35 }}
              className="fixed top-0 bottom-0 right-0 w-full max-w-lg bg-white shadow-2xl z-[150] flex flex-col border-l border-[#E2E8F0]"
            >
              <div className="h-[88px] border-b border-[#E2E8F0] px-6 md:px-8 flex items-center justify-between shrink-0 bg-[#F8FAFC]">
                <h3 className="font-serif text-[18px] uppercase tracking-wider">Enquiry Details</h3>
                <button onClick={() => setSelectedEnquiry(null)} className="text-[#64748B] hover:text-[#0B1117] p-2 rounded-lg hover:bg-white border border-transparent hover:border-[#E2E8F0]">
                  <Icon icon="lucide:x" width="20" height="20" />
                </button>
              </div>

              <div className="flex-grow p-6 md:p-8 overflow-y-auto flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-medium text-[#8E9CAE] uppercase tracking-wider">Client Name</span>
                  <p className="text-[18px] font-bold text-[#0B1117]">{selectedEnquiry.name}</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-medium text-[#8E9CAE] uppercase tracking-wider">Email Address</span>
                  <a href={`mailto:${selectedEnquiry.email}`} className="text-[#0b1117] font-semibold hover:underline text-[15px] flex items-center gap-2">
                    <Icon icon="lucide:mail" width="16" height="16" />
                    {selectedEnquiry.email}
                  </a>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-medium text-[#8E9CAE] uppercase tracking-wider">Subject</span>
                  <p className="text-[16px] font-medium text-[#0b1117] bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]/30">{selectedEnquiry.subject}</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-medium text-[#8E9CAE] uppercase tracking-wider">Message Details</span>
                  <div className="text-[15px] leading-[1.6] text-[#4A5568] bg-[#F8FAFC] p-5 rounded-xl border border-[#E2E8F0]/30 whitespace-pre-line">
                    {selectedEnquiry.message || "(No message content provided)"}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 mt-auto">
                  <span className="text-[11px] font-medium text-[#8E9CAE] uppercase tracking-wider">Date Received</span>
                  <p className="text-[13px] text-[#64748B] font-medium">{selectedEnquiry.date}</p>
                </div>
              </div>

              <div className="p-6 border-t border-[#E2E8F0] flex gap-3 bg-[#F8FAFC] shrink-0">
                <button 
                  onClick={() => {
                    setDeleteConfirm({ open: true, type: "enquiry", id: selectedEnquiry.id });
                    setSelectedEnquiry(null);
                  }}
                  className="flex-grow h-[48px] bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-semibold transition-colors border border-red-100 flex items-center justify-center gap-2"
                >
                  <Icon icon="lucide:trash-2" width="16" height="16" />
                  <span>Delete Enquiry</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- DELETE CONFIRMATION DIALOG --- */}
      <AnimatePresence>
        {deleteConfirm && deleteConfirm.open && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(null)}
              className="fixed inset-0 bg-black"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-[24px] shadow-2xl p-6 md:p-8 max-w-md w-full z-10 border border-[#E2E8F0] flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2">
                <h3 className="font-serif text-[18px] uppercase tracking-wide text-[#0B1117]">Delete Confirmation</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  Are you absolutely sure you want to delete this {deleteConfirm.type}? This action is permanent and will instantly update the user-facing website.
                </p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={confirmDelete}
                  className="flex-grow h-[46px] bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  Confirm Delete
                </button>
                <button 
                  onClick={() => setDeleteConfirm(null)}
                  className="px-5 h-[46px] border border-[#CBD5E1] rounded-xl text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- EDIT CREDENTIALS DIALOG --- */}
      <AnimatePresence>
        {credentialsModalOpen && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setCredentialsModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-[24px] shadow-2xl p-6 md:p-8 max-w-md w-full z-10 border border-[#E2E8F0] flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2">
                <h3 className="font-serif text-[18px] uppercase tracking-wide text-[#0B1117]">Edit Admin Credentials</h3>
                <p className="text-[12px] text-[#64748B] leading-relaxed">
                  Update the login username and password for security.
                </p>
              </div>

              <form onSubmit={handleSaveCredentials} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[#1A1F2A]">Username</label>
                  <input 
                    type="text" 
                    value={credForm.username}
                    onChange={(e) => setCredForm({ ...credForm, username: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl h-[46px] px-4 text-sm text-[#1A1F2A] outline-none focus:border-[#0B1117]"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[#1A1F2A]">Password</label>
                  <input 
                    type="text" 
                    value={credForm.password}
                    onChange={(e) => setCredForm({ ...credForm, password: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl h-[46px] px-4 text-sm text-[#1A1F2A] outline-none focus:border-[#0B1117]"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button 
                    type="submit"
                    className="flex-grow h-[46px] bg-[#0B1117] hover:bg-[#1A1F2A] text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Save Credentials
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCredentialsModalOpen(false)}
                    className="px-5 h-[46px] border border-[#CBD5E1] rounded-xl text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

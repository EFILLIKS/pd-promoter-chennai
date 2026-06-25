"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export interface Project {
  id: number;
  title: string;
  bhk: string;
  location: string;
  status: "Available" | "Booked" | "Delivered";
  imageSrc: string;
  showOnHomepage: boolean;
  brochure?: { fileUrl: string; publicId: string; fileType: string } | null;
  locationData?: { address: string; place?: string; latitude?: string | number; longitude?: string | number } | null;
  gallery?: { imageUrl: string; publicId: string }[] | null;
}

export interface Testimonial {
  id: number;
  content: string;
  name: string;
  designation: string;
  glowBig: string;
  glowSmall: string;
  image?: { imageUrl: string; publicId: string } | null;
}

export interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  date: string;
}

export interface CompanySettings {
  companyName: string;
  phone: string;
  email: string;
  address: string;
  adminUsername: string;
  adminPassword: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
}

export interface HighlightedVideo {
  videoUrl: string;
  publicId: string;
}

interface DataContextType {
  projects: Project[];
  testimonials: Testimonial[];
  enquiries: Enquiry[];
  settings: CompanySettings;
  highlightedVideo: HighlightedVideo | null;
  addProject: (project: Omit<Project, "id">) => Promise<void>;
  editProject: (project: Project) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  addTestimonial: (testimonial: Omit<Testimonial, "id">) => Promise<void>;
  editTestimonial: (testimonial: Testimonial) => Promise<void>;
  deleteTestimonial: (id: number) => Promise<void>;
  addEnquiry: (enquiry: Omit<Enquiry, "id" | "date">) => Promise<void>;
  deleteEnquiry: (id: number) => Promise<void>;
  updateSettings: (settings: CompanySettings) => Promise<void>;
  updateHighlightedVideo: (video: HighlightedVideo | null) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 1,
    title: "VILLA BREEZE",
    bhk: "4 BHK",
    location: "Valasaravakkam",
    status: "Available",
    imageSrc: "/assets/About2.png",
    showOnHomepage: true,
    locationData: { address: "Valasaravakkam, Chennai" },
  },
  {
    id: 2,
    title: "THE GRID RESIDENCE",
    bhk: "4 BHK",
    location: "Ambur",
    status: "Delivered",
    imageSrc: "/assets/Property2.png",
    showOnHomepage: true,
    locationData: { address: "Ambur, Tamil Nadu" },
  },
  {
    id: 3,
    title: "SERENITY GROVE",
    bhk: "3 BHK",
    location: "Kolathur",
    status: "Available",
    imageSrc: "/assets/Property3.png",
    showOnHomepage: true,
    locationData: { address: "Kolathur, Chennai" },
  },
  {
    id: 4,
    title: "MAJESTIC CREST",
    bhk: "4 BHK",
    location: "Valasaravakkam",
    status: "Available",
    imageSrc: "/assets/Property4.png",
    showOnHomepage: true,
    locationData: { address: "Maduravoyal, Chennai" },
  },
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    content: "“The entire home-buying process was smooth and transparent. The team helped us find a property that matched our budget and lifestyle perfectly. We're thrilled with our new home.”",
    name: "MR. SRINIVASAN",
    designation: "",
    glowBig: "bg-[#7DD3FC]",
    glowSmall: "bg-[#38BDF8]",
  },
  {
    id: 2,
    content: "“What impressed me most was the quality of construction and attention to detail. The property looks even better in person than in the photos.”",
    name: "MR. VIJAYARAGAVAN",
    designation: "MD (Medlearn vision healthcare solutions pvt ltd)",
    glowBig: "bg-[#FEF08A]",
    glowSmall: "bg-[#D9F99D]",
  },
  {
    id: 3,
    content: "“From the first site visit to the final paperwork, everything was handled professionally. I felt confident throughout the journey.”",
    name: "MR. DHEENADAYALAN",
    designation: "CEO (sathya homeappliances agencies)",
    glowBig: "bg-[#FDBA74]",
    glowSmall: "bg-[#FB923C]",
  },
  {
    id: 4,
    content: "“Excellent customer service and honest guidance. They took the time to understand our needs and showed us options that truly fit.”",
    name: "MR. K.K. ANAND",
    designation: "MD (Smart learn accademy)",
    glowBig: "bg-[#F9A8D4]",
    glowSmall: "bg-[#F472B6]",
  },
];

const DEFAULT_SETTINGS: CompanySettings = {
  companyName: "PD Construction",
  phone: "+91 88255 28284",
  email: "pdconstruction91@gmail.com",
  address: "No.159, 14th Street, Sri Krishna Nagar, Maduravoyal, Chennai, Tamil Nadu, 600095",
  adminUsername: "Admin",
  adminPassword: "Admin@123",
  instagram: "#",
  twitter: "#",
  facebook: "#",
};

// Helper to delete a Cloudinary asset
const deleteCloudinaryAsset = async (publicId: string | undefined, resourceType: string = "image") => {
  if (!publicId) return;
  try {
    const response = await fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId, resourceType }),
    });
    const result = await response.json();
    console.log(`Cloudinary asset deletion result for ${publicId}:`, result);
  } catch (err) {
    console.error(`Error deleting Cloudinary asset ${publicId}:`, err);
  }
};

// Extractor helper to parse Cloudinary Info from URL
const extractCloudinaryInfo = (url: string | undefined) => {
  if (!url || !url.includes("cloudinary.com")) return null;
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    const afterUpload = parts[1];
    const pathParts = afterUpload.split("/");
    if (pathParts[0].match(/^v\d+$/)) {
      pathParts.shift();
    }
    const publicIdWithExt = pathParts.join("/");
    const lastDotIndex = publicIdWithExt.lastIndexOf(".");
    const publicId = lastDotIndex !== -1 ? publicIdWithExt.substring(0, lastDotIndex) : publicIdWithExt;
    
    let resourceType = "image";
    if (url.includes("/video/upload/")) {
      resourceType = "video";
    } else if (url.includes("/raw/upload/")) {
      resourceType = "raw";
    }
    return { publicId, resourceType };
  } catch (e) {
    return null;
  }
};

// Safe helper to parse location data
const parseLocation = (location: any) => {
  if (!location) return { address: "", place: "", latitude: "", longitude: "" };
  if (typeof location === "object") {
    return {
      address: location.address || "",
      place: location.place || "",
      latitude: location.latitude || "",
      longitude: location.longitude || ""
    };
  }
  if (typeof location === "string") {
    try {
      const trimmed = location.trim();
      if (trimmed.startsWith("{")) {
        const parsed = JSON.parse(trimmed);
        return {
          address: parsed.address || "",
          place: parsed.place || "",
          latitude: parsed.latitude || "",
          longitude: parsed.longitude || ""
        };
      }
    } catch (e) {}
  }
  return { address: location, place: location, latitude: "", longitude: "" };
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [settings, setSettings] = useState<CompanySettings>(DEFAULT_SETTINGS);
  const [highlightedVideo, setHighlightedVideo] = useState<HighlightedVideo | null>({ videoUrl: "/assets/PD.mp4", publicId: "" });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load Projects from Supabase
        const { data: dbProjects, error: projErr } = await supabase
          .from("projects")
          .select("*")
          .order("id", { ascending: true });
        
        if (!projErr && dbProjects && dbProjects.length > 0) {
          const normalized = dbProjects.map(p => {
            const locObj = parseLocation(p.location);
            return {
              ...p,
              location: locObj.place || locObj.address,
              locationData: locObj
            };
          });
          setProjects(normalized);
        } else {
          const storedProjects = localStorage.getItem("pd_projects");
          if (storedProjects) setProjects(JSON.parse(storedProjects));
        }

        // Load Testimonials from Supabase
        const { data: dbTestimonials, error: testErr } = await supabase
          .from("testimonials")
          .select("*")
          .order("id", { ascending: true });
          
        if (!testErr && dbTestimonials && dbTestimonials.length > 0) {
          setTestimonials(dbTestimonials);
        } else {
          const storedTestimonials = localStorage.getItem("pd_testimonials");
          if (storedTestimonials) setTestimonials(JSON.parse(storedTestimonials));
        }

        // Load Enquiries from Supabase
        const { data: dbEnquiries, error: enqErr } = await supabase
          .from("enquiries")
          .select("*")
          .order("id", { ascending: false });
          
        if (!enqErr && dbEnquiries) {
          setEnquiries(dbEnquiries);
        } else {
          const storedEnquiries = localStorage.getItem("pd_enquiries");
          if (storedEnquiries) setEnquiries(JSON.parse(storedEnquiries));
        }

        // Load Settings from Supabase
        const { data: dbSettings, error: settErr } = await supabase
          .from("settings")
          .select("*")
          .limit(1);
          
        const storedSettings = localStorage.getItem("pd_settings");
        const parsedLocal = storedSettings ? JSON.parse(storedSettings) : {};

        if (!settErr && dbSettings && dbSettings.length > 0) {
          setSettings({ ...DEFAULT_SETTINGS, ...parsedLocal, ...dbSettings[0] });
        } else {
          setSettings({ ...DEFAULT_SETTINGS, ...parsedLocal });
        }

        // Load Highlighted Home Video from Supabase
        const { data: dbVideo } = await supabase
          .from("highlighted_home")
          .select("*")
          .limit(1);
        if (dbVideo && dbVideo.length > 0 && dbVideo[0].video) {
          setHighlightedVideo(dbVideo[0].video);
        } else {
          const storedVideo = localStorage.getItem("pd_highlighted_video");
          if (storedVideo) setHighlightedVideo(JSON.parse(storedVideo));
        }
      } catch (e) {
        console.error("Error loading data from Supabase/localStorage:", e);
      }
      setIsInitialized(true);
    };

    loadData();
  }, []);

  // Sync to LocalStorage (only after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("pd_projects", JSON.stringify(projects));
  }, [projects, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("pd_testimonials", JSON.stringify(testimonials));
  }, [testimonials, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("pd_enquiries", JSON.stringify(enquiries));
  }, [enquiries, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("pd_settings", JSON.stringify(settings));
  }, [settings, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    if (highlightedVideo) {
      localStorage.setItem("pd_highlighted_video", JSON.stringify(highlightedVideo));
    } else {
      localStorage.removeItem("pd_highlighted_video");
    }
  }, [highlightedVideo, isInitialized]);

  // Project Mutations
  const addProject = async (project: Omit<Project, "id">) => {
    const nextId = projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1;
    
    const newProj: Project = {
      ...project,
      id: nextId,
      location: project.locationData?.address || project.location || "",
    };
    
    setProjects((prev) => [...prev, newProj]);

    const dbPayload = {
      id: nextId,
      title: project.title,
      bhk: project.bhk,
      status: project.status,
      imageSrc: project.imageSrc,
      showOnHomepage: project.showOnHomepage,
      brochure: project.brochure || null,
      gallery: project.gallery || null,
      location: project.locationData || { address: project.location || "", place: project.location || "", latitude: "", longitude: "" }
    };

    try {
      await supabase.from("projects").insert([dbPayload]);
    } catch (err) {
      console.error("Supabase insert project error:", err);
    }
  };

  const editProject = async (updated: Project) => {
    // Retrieve old project to see if any assets were replaced/removed
    const oldProject = projects.find(p => p.id === updated.id);
    if (oldProject) {
      // 1. Check main image replacement
      if (oldProject.imageSrc !== updated.imageSrc) {
        const info = extractCloudinaryInfo(oldProject.imageSrc);
        if (info) await deleteCloudinaryAsset(info.publicId, info.resourceType);
      }
      // 2. Check brochure replacement/removal
      if (oldProject.brochure && (!updated.brochure || oldProject.brochure.publicId !== updated.brochure.publicId)) {
        await deleteCloudinaryAsset(oldProject.brochure.publicId, oldProject.brochure.fileType || "raw");
      }
      // 3. Check gallery items removal
      if (oldProject.gallery) {
        const currentGalleryIds = new Set((updated.gallery || []).map(g => g.publicId));
        for (const item of oldProject.gallery) {
          if (!currentGalleryIds.has(item.publicId)) {
            await deleteCloudinaryAsset(item.publicId, "image");
          }
        }
      }
    }

    const nextProj: Project = {
      ...updated,
      location: updated.locationData?.address || updated.location || "",
    };

    setProjects((prev) => prev.map((p) => (p.id === updated.id ? nextProj : p)));

    const dbPayload = {
      id: updated.id,
      title: updated.title,
      bhk: updated.bhk,
      status: updated.status,
      imageSrc: updated.imageSrc,
      showOnHomepage: updated.showOnHomepage,
      brochure: updated.brochure || null,
      gallery: updated.gallery || null,
      location: updated.locationData || { address: updated.location || "", place: updated.location || "", latitude: "", longitude: "" }
    };

    try {
      await supabase.from("projects").update(dbPayload).eq("id", updated.id);
    } catch (err) {
      console.error("Supabase update project error:", err);
    }
  };

  const deleteProject = async (id: number) => {
    const projectToDelete = projects.find(p => p.id === id);
    if (projectToDelete) {
      // 1. Delete main image
      const info = extractCloudinaryInfo(projectToDelete.imageSrc);
      if (info) await deleteCloudinaryAsset(info.publicId, info.resourceType);

      // 2. Delete brochure
      if (projectToDelete.brochure) {
        await deleteCloudinaryAsset(projectToDelete.brochure.publicId, projectToDelete.brochure.fileType || "raw");
      }

      // 3. Delete gallery
      if (projectToDelete.gallery) {
        for (const item of projectToDelete.gallery) {
          await deleteCloudinaryAsset(item.publicId, "image");
        }
      }
    }

    setProjects((prev) => prev.filter((p) => p.id !== id));

    try {
      await supabase.from("projects").delete().eq("id", id);
    } catch (err) {
      console.error("Supabase delete project error:", err);
    }
  };

  // Testimonial Mutations
  const addTestimonial = async (testimonial: Omit<Testimonial, "id">) => {
    const nextId = testimonials.length > 0 ? Math.max(...testimonials.map((t) => t.id)) + 1 : 1;
    const newTestimonial = { ...testimonial, id: nextId };
    setTestimonials((prev) => [...prev, newTestimonial]);

    try {
      await supabase.from("testimonials").insert([newTestimonial]);
    } catch (err) {
      console.error("Supabase insert testimonial error:", err);
    }
  };

  const editTestimonial = async (updated: Testimonial) => {
    const oldTestimonial = testimonials.find(t => t.id === updated.id);
    if (oldTestimonial && oldTestimonial.image && (!updated.image || oldTestimonial.image.publicId !== updated.image.publicId)) {
      await deleteCloudinaryAsset(oldTestimonial.image.publicId, "image");
    }

    setTestimonials((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));

    try {
      await supabase.from("testimonials").update(updated).eq("id", updated.id);
    } catch (err) {
      console.error("Supabase update testimonial error:", err);
    }
  };

  const deleteTestimonial = async (id: number) => {
    const testimonialToDelete = testimonials.find(t => t.id === id);
    if (testimonialToDelete && testimonialToDelete.image) {
      await deleteCloudinaryAsset(testimonialToDelete.image.publicId, "image");
    }

    setTestimonials((prev) => prev.filter((t) => t.id !== id));

    try {
      await supabase.from("testimonials").delete().eq("id", id);
    } catch (err) {
      console.error("Supabase delete testimonial error:", err);
    }
  };

  // Enquiry Mutations
  const addEnquiry = async (enquiry: Omit<Enquiry, "id" | "date">) => {
    const newEnquiry: Enquiry = {
      ...enquiry,
      id: enquiries.length > 0 ? Math.max(...enquiries.map((e) => e.id)) + 1 : 1,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setEnquiries((prev) => [newEnquiry, ...prev]);

    try {
      await supabase.from("enquiries").insert([newEnquiry]);
    } catch (err) {
      console.error("Supabase insert enquiry error:", err);
    }
  };

  const deleteEnquiry = async (id: number) => {
    setEnquiries((prev) => prev.filter((e) => e.id !== id));

    try {
      await supabase.from("enquiries").delete().eq("id", id);
    } catch (err) {
      console.error("Supabase delete enquiry error:", err);
    }
  };

  // Settings Mutations
  const updateSettings = async (updated: CompanySettings) => {
    setSettings(updated);

    try {
      const { data } = await supabase.from("settings").select("*").limit(1);
      if (data && data.length > 0) {
        const { error } = await supabase.from("settings").update(updated).eq("companyName", data[0].companyName);
        if (error) {
          console.warn("Failed to update all settings, retrying with basic settings fields...", error);
          const basicPayload = {
            companyName: updated.companyName,
            phone: updated.phone,
            email: updated.email,
            address: updated.address,
            adminUsername: updated.adminUsername,
            adminPassword: updated.adminPassword,
          };
          await supabase.from("settings").update(basicPayload).eq("companyName", data[0].companyName);
        }
      } else {
        const { error } = await supabase.from("settings").insert([updated]);
        if (error) {
          console.warn("Failed to insert all settings, retrying with basic settings fields...", error);
          const basicPayload = {
            companyName: updated.companyName,
            phone: updated.phone,
            email: updated.email,
            address: updated.address,
            adminUsername: updated.adminUsername,
            adminPassword: updated.adminPassword,
          };
          await supabase.from("settings").insert([basicPayload]);
        }
      }
    } catch (err) {
      console.error("Supabase update settings error:", err);
    }
  };

  // Highlighted Video Mutations
  const updateHighlightedVideo = async (video: HighlightedVideo | null) => {
    const oldVideo = highlightedVideo;
    if (oldVideo && oldVideo.publicId && (!video || oldVideo.publicId !== video.publicId)) {
      await deleteCloudinaryAsset(oldVideo.publicId, "video");
    }

    setHighlightedVideo(video);

    try {
      // Upsert the single row in highlighted_home (id = 1)
      const { data } = await supabase.from("highlighted_home").select("*").eq("id", 1);
      if (data && data.length > 0) {
        await supabase.from("highlighted_home").update({ video }).eq("id", 1);
      } else {
        await supabase.from("highlighted_home").insert([{ id: 1, video }]);
      }
    } catch (err) {
      console.error("Supabase update highlighted video error:", err);
    }
  };

  return (
    <DataContext.Provider
      value={{
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
        addEnquiry,
        deleteEnquiry,
        updateSettings,
        updateHighlightedVideo,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

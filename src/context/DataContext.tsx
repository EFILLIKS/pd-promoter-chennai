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
}

export interface Testimonial {
  id: number;
  content: string;
  name: string;
  designation: string;
  glowBig: string;
  glowSmall: string;
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

interface DataContextType {
  projects: Project[];
  testimonials: Testimonial[];
  enquiries: Enquiry[];
  settings: CompanySettings;
  addProject: (project: Omit<Project, "id">) => void;
  editProject: (project: Project) => void;
  deleteProject: (id: number) => void;
  addTestimonial: (testimonial: Omit<Testimonial, "id">) => void;
  editTestimonial: (testimonial: Testimonial) => void;
  deleteTestimonial: (id: number) => void;
  addEnquiry: (enquiry: Omit<Enquiry, "id" | "date">) => void;
  deleteEnquiry: (id: number) => void;
  updateSettings: (settings: CompanySettings) => void;
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
  },
  {
    id: 2,
    title: "THE GRID RESIDENCE",
    bhk: "4 BHK",
    location: "Ambur",
    status: "Delivered",
    imageSrc: "/assets/Property2.png",
    showOnHomepage: true,
  },
  {
    id: 3,
    title: "SERENITY GROVE",
    bhk: "3 BHK",
    location: "Kolathur",
    status: "Available",
    imageSrc: "/assets/Property3.png",
    showOnHomepage: true,
  },
  {
    id: 4,
    title: "MAJESTIC CREST",
    bhk: "4 BHK",
    location: "Valasaravakkam",
    status: "Available",
    imageSrc: "/assets/Property4.png",
    showOnHomepage: true,
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

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [settings, setSettings] = useState<CompanySettings>(DEFAULT_SETTINGS);
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
          setProjects(dbProjects);
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

  // Project Mutations
  const addProject = async (project: Omit<Project, "id">) => {
    const nextId = projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1;
    const newProj = { ...project, id: nextId };
    setProjects((prev) => [...prev, newProj]);

    try {
      await supabase.from("projects").insert([newProj]);
    } catch (err) {
      console.error("Supabase insert project error:", err);
    }
  };

  const editProject = async (updated: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

    try {
      await supabase.from("projects").update(updated).eq("id", updated.id);
    } catch (err) {
      console.error("Supabase update project error:", err);
    }
  };

  const deleteProject = async (id: number) => {
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
    setTestimonials((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));

    try {
      await supabase.from("testimonials").update(updated).eq("id", updated.id);
    } catch (err) {
      console.error("Supabase update testimonial error:", err);
    }
  };

  const deleteTestimonial = async (id: number) => {
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
      // Since settings has no ID or is a single configuration row, we can upsert
      // matching the companyName, or just update the table.
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

  return (
    <DataContext.Provider
      value={{
        projects,
        testimonials,
        enquiries,
        settings,
        addProject,
        editProject,
        deleteProject,
        addTestimonial,
        editTestimonial,
        deleteTestimonial,
        addEnquiry,
        deleteEnquiry,
        updateSettings,
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

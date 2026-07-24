import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { siteConfig } from "@content/site.config";

export interface ContactFormErrors {
  name?: string;
  email?: string;
}

/**
 * Contact form state and submission flow: field values, inline validation
 * errors, and the POST /api/contact mutation. On success the enquiry is
 * stored, a toast confirms it, and the visitor's email client opens
 * pre-filled (mailto handoff); on error a destructive toast is shown.
 */
export function useContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: { name: string; email: string; message: string | null }) => {
      const res = await apiRequest("POST", "/api/contact", data);
      return res.json();
    },
    onSuccess: (_data, variables) => {
      toast({
        title: "Message saved",
        description: "Your enquiry has been recorded. Your email client will open so you can send it directly.",
      });

      const subject = encodeURIComponent(`New enquiry from ${variables.name}`);
      const body = encodeURIComponent(
        `Name: ${variables.name}\nEmail: ${variables.email}\n\n${variables.message || ""}`
      );
      window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;

      setName("");
      setEmail("");
      setMessage("");
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Your message could not be saved. Please try again or email us directly.",
        variant: "destructive",
      });
    },
  });

  const onNameChange = (value: string) => {
    setName(value);
    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
  };

  const onEmailChange = (value: string) => {
    setEmail(value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
  };

  const onMessageChange = (value: string) => {
    setMessage(value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: ContactFormErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    mutation.mutate({ name: name.trim(), email: email.trim(), message: message.trim() || null });
  };

  return {
    name,
    email,
    message,
    errors,
    isPending: mutation.isPending,
    onNameChange,
    onEmailChange,
    onMessageChange,
    handleSubmit,
  };
}

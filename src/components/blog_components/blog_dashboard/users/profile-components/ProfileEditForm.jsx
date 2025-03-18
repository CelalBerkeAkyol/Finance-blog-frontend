import React from "react";
import { Input, Textarea } from "@nextui-org/react";

// Profil bilgileri düzenleme formu
const ProfileEditForm = ({ formData, handleChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input
      label="Kullanıcı Adı"
      name="userName"
      value={formData.userName}
      onChange={handleChange}
      variant="bordered"
      isDisabled
    />
    <Input
      label="Tam Ad"
      name="fullName"
      value={formData.fullName}
      onChange={handleChange}
      variant="bordered"
    />
    <Input
      label="E-posta"
      name="email"
      value={formData.email}
      onChange={handleChange}
      variant="bordered"
      isDisabled
    />
    <Input
      label="Meslek"
      name="occupation"
      value={formData.occupation}
      onChange={handleChange}
      variant="bordered"
    />
    <Input
      label="Web Sitesi"
      name="website"
      value={formData.website}
      onChange={handleChange}
      variant="bordered"
    />
    <Input
      label="Twitter"
      name="socialLinks.twitter"
      value={formData.socialLinks?.twitter}
      onChange={handleChange}
      variant="bordered"
    />
    <Input
      label="LinkedIn"
      name="socialLinks.linkedin"
      value={formData.socialLinks?.linkedin}
      onChange={handleChange}
      variant="bordered"
    />
    <Input
      label="GitHub"
      name="socialLinks.github"
      value={formData.socialLinks?.github}
      onChange={handleChange}
      variant="bordered"
    />
    <Textarea
      label="Biyografi"
      name="bio"
      value={formData.bio}
      onChange={handleChange}
      variant="bordered"
      className="col-span-1 md:col-span-2"
      maxLength={500}
    />
  </div>
);

export default ProfileEditForm;

import React from "react";
import { Tabs, Tab, Link } from "@nextui-org/react";
import { Icon } from "@iconify/react";

// Profil sekmeleri
const ProfileTabs = ({ userInfo }) => (
  <Tabs aria-label="Profil Bilgileri">
    <Tab key="about" title="Hakkında">
      <div className="space-y-4 p-4">
        <div>
          <h5 className="text-sm font-semibold text-default-500">Biyografi</h5>
          <p className="mt-1">
            {userInfo.bio || "Henüz bir biyografi eklenmemiş."}
          </p>
        </div>
        <div>
          <h5 className="text-sm font-semibold text-default-500">Meslek</h5>
          <p className="mt-1">{userInfo.occupation || "Belirtilmemiş"}</p>
        </div>
        <div>
          <h5 className="text-sm font-semibold text-default-500">Web Sitesi</h5>
          {userInfo.website ? (
            <Link
              href={userInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1"
            >
              {userInfo.website}
            </Link>
          ) : (
            <p className="mt-1">Belirtilmemiş</p>
          )}
        </div>
      </div>
    </Tab>
    <Tab key="contact" title="İletişim">
      <div className="space-y-4 p-4">
        <div>
          <h5 className="text-sm font-semibold text-default-500">E-posta</h5>
          <p className="mt-1">{userInfo.email}</p>
        </div>
        <div>
          <h5 className="text-sm font-semibold text-default-500">
            Sosyal Medya
          </h5>
          <div className="flex gap-4 mt-2">
            {userInfo.socialLinks?.twitter && (
              <Link
                href={userInfo.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon icon="mdi:twitter" width={24} />
              </Link>
            )}
            {userInfo.socialLinks?.linkedin && (
              <Link
                href={userInfo.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon icon="mdi:linkedin" width={24} />
              </Link>
            )}
            {userInfo.socialLinks?.github && (
              <Link
                href={userInfo.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon icon="mdi:github" width={24} />
              </Link>
            )}
            {!userInfo.socialLinks?.twitter &&
              !userInfo.socialLinks?.linkedin &&
              !userInfo.socialLinks?.github && (
                <p>Sosyal medya hesapları belirtilmemiş</p>
              )}
          </div>
        </div>
      </div>
    </Tab>
    <Tab key="account" title="Hesap">
      <div className="space-y-4 p-4">
        <div>
          <h5 className="text-sm font-semibold text-default-500">
            Kullanıcı Adı
          </h5>
          <p className="mt-1">{userInfo.userName || userInfo.username}</p>
        </div>
        <div>
          <h5 className="text-sm font-semibold text-default-500">Rol</h5>
          <p className="mt-1">{userInfo.role}</p>
        </div>
        <div>
          <h5 className="text-sm font-semibold text-default-500">
            Hesap Durumu
          </h5>
          <p className="mt-1">
            {userInfo.isVerified ? "Doğrulanmış" : "Doğrulanmamış"}
          </p>
        </div>
        <div>
          <h5 className="text-sm font-semibold text-default-500">
            Kayıt Tarihi
          </h5>
          <p className="mt-1">
            {userInfo.createdAt
              ? new Date(userInfo.createdAt).toLocaleDateString("tr-TR")
              : "Belirtilmemiş"}
          </p>
        </div>
      </div>
    </Tab>
  </Tabs>
);

export default ProfileTabs;

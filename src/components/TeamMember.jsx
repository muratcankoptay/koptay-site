import { Mail, Phone, Linkedin } from "lucide-react"

const TeamMember = ({ member }) => {
  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      {/* Fotoğraf */}
      <div className="relative overflow-hidden h-80 bg-gradient-to-br from-lawPrimary/10 to-lawSecondary/10">
        {member.image ? (
          <img 
            src={member.image} 
            alt={member.name}
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-lawPrimary/20 flex items-center justify-center">
              <span className="text-5xl font-serif text-lawPrimary">
                {member.name.charAt(0)}
              </span>
            </div>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-lawDark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* İçerik */}
      <div className="p-6">
        {/* İsim ve Ünvan */}
        <div className="mb-4">
          <h3 className="text-2xl font-serif font-bold text-lawDark mb-2">
            {member.name}
          </h3>
          <p className="text-lawSecondary font-medium uppercase tracking-wide text-sm">
            {member.title}
          </p>
          {member.specialization && (
            <p className="text-gray-600 text-sm mt-1 italic">
              {member.specialization}
            </p>
          )}
        </div>

        {/* Biyografi */}
        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed line-clamp-4">
            {member.bio}
          </p>
        </div>

        {/* Eğitim */}
        {member.education && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-lawDark mb-2 uppercase tracking-wide">
              Eğitim
            </h4>
            <ul className="space-y-1">
              {member.education.map((edu, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start">
                  <span className="text-lawSecondary mr-2">•</span>
                  <span>{edu}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Uzmanlık Alanları */}
        {member.expertise && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-lawDark mb-2 uppercase tracking-wide">
              Uzmanlık Alanları
            </h4>
            <div className="flex flex-wrap gap-2">
              {member.expertise.map((area, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-lawPrimary/10 text-lawDark text-xs rounded-full border border-lawPrimary/20"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* İletişim Bilgileri */}
        <div className="pt-4 border-t border-gray-200 space-y-2">
          {member.email && (
            <a 
              href={`mailto:${member.email}`}
              className="flex items-center text-sm text-gray-600 hover:text-lawSecondary transition-colors duration-200"
            >
              <Mail size={16} className="mr-2" />
              {member.email}
            </a>
          )}
          {member.phone && (
            <a 
              href={`tel:${member.phone}`}
              className="flex items-center text-sm text-gray-600 hover:text-lawSecondary transition-colors duration-200"
            >
              <Phone size={16} className="mr-2" />
              {member.phone}
            </a>
          )}
          {member.linkedin && (
            <a 
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-gray-600 hover:text-lawSecondary transition-colors duration-200"
            >
              <Linkedin size={16} className="mr-2" />
              LinkedIn Profili
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default TeamMember

// AnnouncementModal.tsx
import React from 'react'
import { useAnnouncements } from '../../hooks/AnnouncementsContext'

const AnnouncementModal: React.FC = () => {
  const { currentAnnouncement, dismissCurrent } = useAnnouncements()

  if (!currentAnnouncement) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center h-full bg-black/60">
      <div className="bg-primary rounded-lg shadow-lg border-[#a9885c] border-2 h-64 w-[70vw]">
        <div className="flex items-center mb-2 border-[#a9885c] py-4 px-6 border-b-2">
          <span
            className={`mr-2 ${currentAnnouncement.type === 'warning' ? 'text-amber-600' : currentAnnouncement.type === 'error' ? 'text-red-800' : currentAnnouncement.type === 'success' ? 'text-green-800' : 'text-sky-700'}`}
          >
            {currentAnnouncement.icon}
          </span>
          <h2
            className={`font-bold text-2xl ${currentAnnouncement.type === 'warning' ? 'text-amber-600' : currentAnnouncement.type === 'error' ? 'text-red-800' : currentAnnouncement.type === 'success' ? 'text-green-800' : 'text-sky-700'}`}
          >
            {currentAnnouncement.title}
          </h2>
          <button className="bg-none border-0 text-4xl ml-auto hover:text-red-800" onClick={dismissCurrent}>
            ⨯
          </button>
        </div>
        <div className="flex flex-col justify-center items-center mb-4 py-2 px-6 h-[160px]">
          <p className="text-xl">{currentAnnouncement.message}</p>
          {/* <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={dismissCurrent}> */}
          {/* Dismiss */}
          {/* </button> */}
        </div>
      </div>
    </div>
  )
}

export default AnnouncementModal

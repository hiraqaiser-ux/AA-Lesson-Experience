import { useState } from "react";
import { Icon } from "../components/Icon";
import { Button } from "../components/Button";
import { VideoPlayer } from "../components/VideoPlayer";
import { SidebarLessonItem } from "../components/SidebarLessonItem";
import { FinishWatchingModal } from "../components/FinishWatchingModal";
import { PLAYER_NAV } from "../data/course";

export function VideoLessonPlayer() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex min-h-full flex-col bg-popup-bg">
      {/* Top bar */}
      <header className="flex items-center gap-16 border-b border-secondary-900 bg-surface px-24 py-16">
        <span className="text-lg font-bold text-neutral-0">Athan Academy</span>
        <span className="flex-1" />
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          Next lesson
        </Button>
      </header>

      {/* Body */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full shrink-0 border-b border-secondary-900 bg-surface lg:w-[360px] lg:border-b-0 lg:border-r">
          <div className="flex flex-col gap-8 p-20">
            <h2 className="px-12 py-8 text-md font-medium text-neutral-0">Course content</h2>
            {PLAYER_NAV.map((sec) => (
              <div key={sec.section} className="flex flex-col gap-8">
                <div className="flex items-center gap-8 rounded-md px-12 py-12">
                  <span className="flex-1 text-sm font-medium text-neutral-0">
                    {sec.section}
                  </span>
                  <Icon name="chevron-down" size={18} className="text-secondary-300" />
                </div>
                {sec.lessons.map((l) => (
                  <SidebarLessonItem key={l.title} {...l} />
                ))}
              </div>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="flex flex-1 flex-col gap-20 p-24">
          <p className="text-sm text-secondary-300">Module 1 › Welcome to Recite Quran</p>
          <VideoPlayer />
          <div className="flex items-center gap-16">
            <h1 className="flex-1 text-xl font-medium text-neutral-0">
              Understanding words with Baa
            </h1>
            <button className="flex items-center gap-8 text-sm font-medium text-primary-500">
              <Icon name="bookmark" size={18} />
              Save note
            </button>
          </div>
          <p className="max-w-[680px] text-md leading-relaxed text-secondary-300">
            In this lesson you&apos;ll learn to recognise and pronounce the letter Baa
            within common Arabic words. Watch the full video, then continue to the practice
            exercise to reinforce what you learned.
          </p>
        </main>
      </div>

      <FinishWatchingModal
        open={modalOpen}
        onContinue={() => setModalOpen(false)}
        onNext={() => setModalOpen(false)}
      />
    </div>
  );
}

'use client'
import { FormEvent, useMemo, useState, useEffect } from "react";
import { formatLabel, getLabels } from "@/i18n";
import * as LucideIcons from "lucide-react";
const labels = getLabels();

type IconName =
  | "home"
  | "compass"
  | "bell"
  | "message"
  | "bookmark"
  | "user"
  | "search"
  | "plus"
  | "image"
  | "smile"
  | "pin"
  | "heart"
  | "comment"
  | "send"
  | "more"
  | "check";

const paths: Record<IconName, React.ReactNode> = {
  home: <LucideIcons.Home className="button"></LucideIcons.Home>,
  compass: <LucideIcons.Compass className="route"></LucideIcons.Compass>,
  bell: <LucideIcons.Bell className="button"></LucideIcons.Bell>,
  message: <LucideIcons.MessageCircle className="button"></LucideIcons.MessageCircle>,
  bookmark: <LucideIcons.Bookmark className="button"></LucideIcons.Bookmark>,
  user: <LucideIcons.User className="button"></LucideIcons.User>,
  search: <LucideIcons.Search className="button"></LucideIcons.Search>,
  plus: <LucideIcons.Plus className="button"></LucideIcons.Plus>,
  image: <LucideIcons.Image className="button"></LucideIcons.Image>,
  smile: <LucideIcons.Smile className="button"></LucideIcons.Smile>,
  pin: <LucideIcons.MapPin className="button"></LucideIcons.MapPin>,
  heart: <LucideIcons.Heart className="button"></LucideIcons.Heart>,
  comment: <LucideIcons.MessageCircle className="button"></LucideIcons.MessageCircle>,
  send: <LucideIcons.Send className="button"></LucideIcons.Send>,
  more: <LucideIcons.MoreHorizontal className="button"></LucideIcons.MoreHorizontal>,
  check: <LucideIcons.Check className="button"></LucideIcons.Check>,
};

function Icon({
  name,
  size = 21,
  filled = false,
}: {
  name: IconName;
  size?: number;
  filled?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

const photos = {
  hero: "https://images.unsplash.com/photo-1792357485614-1c3a48212ae6?auto=format&fit=crop&w=1400&q=85",
  city: "https://images.unsplash.com/photo-1773236237942-ca8d2772615a?auto=format&fit=crop&w=1400&q=85",
  maya: "https://images.unsplash.com/photo-1529903384028-929ae5dccdf1?auto=format&fit=crop&w=240&q=80",
  luca: "https://images.unsplash.com/photo-1793375516367-1f181cb9304e?auto=format&fit=crop&w=240&q=80",
  noa: "https://images.unsplash.com/photo-1791102625915-e9fb03971787?auto=format&fit=crop&w=240&q=80",
  theo: "https://images.unsplash.com/photo-1789235536832-3be6c6faa7d5?auto=format&fit=crop&w=240&q=80",
  zara: "https://images.unsplash.com/photo-1773236237773-be5baa7945c8?auto=format&fit=crop&w=240&q=80",
};


async function getTrends() {
  const response = await fetch("/api/trends", { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to fetch trends: ${response.status}`);
  }

  return (await response.json()) as { tag: string; posts: number }[];
}

function Trends() {
  const [trends, setTrends] = useState<{ tag: string; posts: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    getTrends()
      .then((data) => {
        if (isMounted) {
          setTrends(data);
          setError(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError("Unable to reach piu-api");
          setTrends([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return <p className="text-xs text-muted">{error}</p>;
  }

  return (
    <ul>
      {trends.map((trend, i) => (
        <li key={trend.tag}>
          <button type="button" className="trend-item">
            <span>
              <small>
                {i + 1} · {labels.sidebar.trending}
              </small>
              <strong>{trend.tag}</strong>
              <small>{trend.posts.toLocaleString()}</small>
            </span>
            <Icon name="more" size={18} />
          </button>
        </li>
      ))}
    </ul>
  );
}
const people = [
  { name: "Noa Williams", handle: "@noawanders", image: photos.noa },
  { name: "Theo Clarke", handle: "@theocreates", image: photos.theo },
  { name: "Zara Bell", handle: "@zarabell", image: photos.zara },
];

function Post({
  author,
  handle,
  avatar,
  image,
  text,
  likes,
  time,
  location,
}: {
  author: string;
  handle: string;
  avatar: string;
  image: string;
  text: string;
  likes: number;
  time: string;
  location?: string;
}) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showComment, setShowComment] = useState(false);

  return (
    <article className="post-card">
      <header className="post-header">
        <img className="avatar" src={avatar} alt="" />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-[15px] text-ink">{author}</h3>
            <span className="verified">
              <Icon name="check" size={9} />
            </span>
          </div>
          <p className="truncate text-xs text-muted">
            {handle} · {time}
            {location ? ` · ${location}` : ""}
          </p>
        </div>
        <button className="icon-btn ml-auto" aria-label={labels.feed.moreOptions}>
          <Icon name="more" />
        </button>
      </header>

      <p className="px-5 pb-4 text-[15px] leading-6 text-ink">{text}</p>
      <img className="post-image" src={image} alt={labels.feed.sharedImageAlt} />

      <div className="post-actions">
        <button
          className={liked ? "action-btn liked" : "action-btn"}
          onClick={() => setLiked(!liked)}
        >
          <Icon name="heart" filled={liked} />
          <span>{(likes + (liked ? 1 : 0)).toLocaleString()}</span>
        </button>
        <button className="action-btn" onClick={() => setShowComment(!showComment)}>
          <Icon name="comment" />
          <span>48</span>
        </button>
        <button className="action-btn">
          <Icon name="send" />
          <span>{labels.feed.share}</span>
        </button>
        <button
          className={saved ? "action-btn ml-auto text-ink" : "action-btn ml-auto"}
          onClick={() => setSaved(!saved)}
          aria-label={labels.feed.savePost}
        >
          <Icon name="bookmark" filled={saved} />
        </button>
      </div>
      {showComment && (
        <div className="comment-row">
          <img className="h-8 w-8 rounded-full object-cover" src={photos.maya} alt="" />
          <input autoFocus placeholder={formatLabel(labels.feed.replyTo, { name: author })} />
          <button onClick={() => setShowComment(false)}>{labels.feed.post}</button>
        </div>
      )}
    </article>
  );
}

export default function SocialApp() {
  const [active, setActive] = useState("home");
  const [feed, setFeed] = useState<"following" | "explore">("following");
  const [draft, setDraft] = useState("");
  const [posted, setPosted] = useState<string[]>([]);
  const [followed, setFollowed] = useState<string[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);

  const nav = useMemo(
    () =>
      [
        ["home", labels.nav.home, "home"],
        ["explore", labels.nav.explore, "compass"],
        ["notifications", labels.nav.notifications, "bell"],
        ["messages", labels.nav.messages, "message"],
        ["bookmarks", labels.nav.bookmarks, "bookmark"],
        ["profile", labels.nav.profile, "user"],
      ] as [string, string, IconName][],
    [],
  );

  function publish(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    setPosted([draft.trim(), ...posted]);
    setDraft("");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">l</span>
          <span>luma</span>
        </div>

        <nav className="nav-list" aria-label={labels.accessibility.mainNavigation}>
          {nav.map(([id, label, icon]) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={active === id ? "nav-item active" : "nav-item"}
            >
              <span className="relative">
                <Icon name={icon} filled={active === id && id === "home"} />
                {id === "notifications" && <i className="notification-dot" />}
              </span>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <button className="create-btn" onClick={() => document.getElementById("composer")?.focus()}>
          <Icon name="plus" size={19} />
          <span>{labels.nav.create}</span>
        </button>

        <button className="profile-chip">
          <img src={photos.maya} alt="Maya profile" />
          <span className="text-left">
            <strong>Maya Chen</strong>
            <small>@mayamakes</small>
          </span>
          <Icon name="more" size={18} />
        </button>
      </aside>

      <main className="main-content">
        <header className="mobile-header">
          <div className="brand">
            <span className="brand-mark">l</span>
            <span>luma</span>
          </div>
          <div className="flex gap-1">
            <button className="icon-btn" aria-label={labels.search.label}>
              <Icon name="search" />
            </button>
            <button className="icon-btn" aria-label={labels.accessibility.messages}>
              <Icon name="message" />
            </button>
          </div>
        </header>

        <section className="feed-column">
          <div className="feed-top">
            <div className="feed-tabs">
              {(["following", "explore"] as const).map((tab) => (
                <button
                  key={tab}
                  className={feed === tab ? "selected" : ""}
                  onClick={() => setFeed(tab)}
                >
                  {labels.feed[tab]}
                </button>
              ))}
            </div>
          </div>

          <form className="composer" onSubmit={publish}>
            <img src={photos.maya} alt="" />
            <div className="flex-1 min-w-0">
              <textarea
                id="composer"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={labels.feed.sharePlaceholder}
                rows={2}
              />
              <div className="composer-bottom">
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="icon-btn accent"
                    aria-label={labels.composer.addPhoto}
                  >
                    <Icon name="image" size={19} />
                  </button>
                  <button
                    type="button"
                    className="icon-btn accent"
                    aria-label={labels.composer.addFeeling}
                  >
                    <Icon name="smile" size={19} />
                  </button>
                  <button
                    type="button"
                    className="icon-btn accent"
                    aria-label={labels.composer.addLocation}
                  >
                    <Icon name="pin" size={19} />
                  </button>
                </div>
                <span className="text-xs text-muted">
                  {draft.length > 0 && `${draft.length}/280`}
                </span>
                <button className="post-btn" disabled={!draft.trim()}>
                  {labels.feed.post}
                </button>
              </div>
            </div>
          </form>

          {posted.map((text, index) => (
            <article className="post-card text-post" key={`${text}-${index}`}>
              <header className="post-header">
                <img className="avatar" src={photos.maya} alt="" />
                <div>
                  <h3 className="font-bold text-[15px]">Maya Chen</h3>
                  <p className="text-xs text-muted">@mayamakes · {labels.feed.now}</p>
                </div>
              </header>
              <p>{text}</p>
              <div className="post-actions">
                <button className="action-btn">
                  <Icon name="heart" />0
                </button>
                <button className="action-btn">
                  <Icon name="comment" />
                  {labels.feed.reply}
                </button>
                <button className="action-btn ml-auto">
                  <Icon name="bookmark" />
                </button>
              </div>
            </article>
          ))}

          <Post
            author="Luca Moreno"
            handle="@lucamoreno"
            avatar={photos.luca}
            image={photos.hero}
            time="2h"
            location="Lisbon"
            likes={1284}
            text="Found the last patch of evening light and stayed until it disappeared. Some days really do ask you to slow down."
          />
          <Post
            author="Zara Bell"
            handle="@zarabell"
            avatar={photos.zara}
            image={photos.city}
            time="5h"
            likes={892}
            text="Color studies from a long walk through the neighborhood. Inspiration is usually hiding in plain sight."
          />
        </section>

        <aside className="right-panel">
          <div className="search-wrap">
            <Icon name="search" size={19} />
            <input
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setSearchOpen(false)}
              placeholder={labels.search.placeholder}
            />
            {searchOpen && <div className="search-popover">{labels.search.suggestion}</div>}
          </div>

          <section className="side-card">
            <div className="side-title">
              <h2>{labels.sidebar.trendingNow}</h2>
              <button>{labels.sidebar.seeAll}</button>
            </div>
            <div className="trend-list">
              <Trends />
            </div>
          </section>

          <section className="side-card">
            <div className="side-title">
              <h2>{labels.sidebar.peopleToKnow}</h2>
              <button>{labels.sidebar.seeAll}</button>
            </div>
            <div className="people-list">
              {people.map((person) => {
                const isFollowing = followed.includes(person.handle);
                return (
                  <div key={person.handle}>
                    <img src={person.image} alt="" />
                    <span>
                      <strong>{person.name}</strong>
                      <small>{person.handle}</small>
                    </span>
                    <button
                      className={isFollowing ? "following" : ""}
                      onClick={() =>
                        setFollowed(
                          isFollowing
                            ? followed.filter((x) => x !== person.handle)
                            : [...followed, person.handle],
                        )
                      }
                    >
                      {isFollowing ? labels.sidebar.following : labels.sidebar.follow}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <footer>
            {labels.footer.about} · {labels.footer.help} · {labels.footer.privacy} ·{" "}
            {labels.footer.terms}
            <br />
            {labels.footer.copyright}
          </footer>
        </aside>
      </main>

      <nav className="bottom-nav" aria-label={labels.accessibility.mobileNavigation}>
        {nav.slice(0, 5).map(([id, label, icon]) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={active === id ? "active" : ""}
            aria-label={label}
          >
            <Icon name={icon} filled={active === id && id === "home"} />
          </button>
        ))}
      </nav>
    </div>
  );
}

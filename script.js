// 表示データは配列にまとめておくと、将来API連携に差し替えやすくなります。
const projects = [
  {
    title: "学習ポートフォリオサイト",
    summary: "学習記録、成果物、資料を整理するための静的Webサイト。就職活動で見せる情報を一画面で確認しやすくした。",
    technologies: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/",
    document: "#documents",
    featured: true
  },
  {
    title: "タスク管理アプリ設計",
    summary: "要件定義、画面設計、データ構造を整理した学習用プロジェクト。業務アプリの基本構成を理解する目的で作成。",
    technologies: ["UI設計", "ER図", "要件定義"],
    github: "https://github.com/",
    document: "#documents",
    featured: true
  },
  {
    title: "JavaScript基礎演習",
    summary: "DOM操作、配列処理、イベント処理を練習する小さなサンプル集。基礎の理解を説明できる形でまとめた。",
    technologies: ["JavaScript", "DOM", "CSS"],
    github: "https://github.com/",
    document: "#documents",
    featured: false
  }
];

// Xのポスト風に表示する短い学習記録です。
const learningLogs = [
  {
    date: "2026.06.09",
    topic: "HTML/CSS",
    text: "ポートフォリオの情報設計を整理。見た目より先に、成果物・学習記録・資料の役割を分けることを意識した。"
  },
  {
    date: "2026.06.08",
    topic: "JavaScript",
    text: "ナビゲーションの切り替え処理を実装。データを配列で持つと、カードやログを増やしやすいことが分かった。"
  },
  {
    date: "2026.06.07",
    topic: "設計",
    text: "将来追加したい機能を先に洗い出した。GitHub API連携や検索機能を後から入れられる構成にしたい。"
  }
];

// 初期表示用の資料データです。アップロードした資料はこの配列の先頭に追加します。
const documents = [
  { name: "ポートフォリオ設計メモ.pdf", type: "PDF", size: "サンプル" },
  { name: "タスク管理アプリ画面設計.md", type: "Markdown", size: "サンプル" },
  { name: "学習ロードマップ.txt", type: "Text", size: "サンプル" }
];

const pageTitle = document.querySelector("#page-title");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".page-section");

function createProjectCard(project) {
  const tags = project.technologies.map((tech) => `<li>${tech}</li>`).join("");

  return `
    <article class="project-card">
      <h3>${project.title}</h3>
      <p>${project.summary}</p>
      <ul class="tag-list" aria-label="使用技術">
        ${tags}
      </ul>
      <div class="link-row">
        <a class="text-link" href="${project.github}" target="_blank" rel="noreferrer">GitHub</a>
        <a class="text-link" href="${project.document}">関連資料</a>
      </div>
    </article>
  `;
}

function createLogCard(log) {
  return `
    <article class="log-card">
      <div class="log-meta">
        <span>${log.date}</span>
        <span>${log.topic}</span>
      </div>
      <p>${log.text}</p>
    </article>
  `;
}

function createDocumentItem(documentItem) {
  return `
    <article class="document-item">
      <div>
        <strong>${documentItem.name}</strong>
        <span>${documentItem.type} / ${documentItem.size}</span>
      </div>
      <a class="text-link" href="#">詳細</a>
    </article>
  `;
}

function renderProjects() {
  // 同じカード生成関数を使い、一覧と注目成果物の両方を描画します。
  document.querySelector("#project-list").innerHTML = projects.map(createProjectCard).join("");
  document.querySelector("#featured-projects").innerHTML = projects
    .filter((project) => project.featured)
    .map(createProjectCard)
    .join("");
}

function renderLogs() {
  document.querySelector("#learning-logs").innerHTML = learningLogs.map(createLogCard).join("");
}

function renderDocuments() {
  document.querySelector("#document-list").innerHTML = documents.map(createDocumentItem).join("");
}

function activateSection(sectionId) {
  // 表示するsectionだけに is-visible を付け、サイドバーの選択状態も同期します。
  sections.forEach((section) => {
    section.classList.toggle("is-visible", section.id === sectionId);
  });

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.section === sectionId);
  });

  const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
  pageTitle.textContent = activeLink ? activeLink.textContent : "ホーム";
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const sectionId = link.dataset.section;
    activateSection(sectionId);
    history.replaceState(null, "", `#${sectionId}`);
  });
});

document.querySelector("#upload-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const fileInput = document.querySelector("#document-upload");
  const selectedFiles = Array.from(fileInput.files);

  // ブラウザだけで動くデモなので、ファイル本体は保存せずメタ情報だけを表示します。
  selectedFiles.forEach((file) => {
    documents.unshift({
      name: file.name,
      type: file.type || "File",
      size: `${Math.ceil(file.size / 1024)}KB`
    });
  });

  renderDocuments();
  fileInput.value = "";
});

renderProjects();
renderLogs();
renderDocuments();
activateSection(location.hash.replace("#", "") || "home");

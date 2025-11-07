export interface Article {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
}

export interface AnnexPart {
  id: string;
  title: string;
  content: string;
}

export interface Annex {
  id: string;
  title: string;
  parts: AnnexPart[];
}

export interface ResumeSection {
  id: string;
  title: string;
  content: string;
}

export interface Resume {
  id: string;
  name: string;
  contact: string;
  sections: ResumeSection[];
}

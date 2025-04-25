import { XMLParser } from 'fast-xml-parser';

interface RSSItem {
  title: string;
  content: string;
  link: string;
  pubDate: string;
}

interface RSSFeed {
  items: RSSItem[];
}

export async function parseRSS(xmlContent: string): Promise<RSSFeed> {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_"
  });

  try {
    const result = parser.parse(xmlContent);
    const channel = result.rss?.channel || result.feed;
    
    if (!channel) {
      throw new Error('Invalid RSS feed format');
    }

    const items = (channel.item || channel.entry || []).map((item: any) => ({
      title: item.title || '',
      content: item.description || item['content:encoded'] || item.content || '',
      link: item.link || '',
      pubDate: item.pubDate || item.published || item.updated || new Date().toISOString()
    }));

    return { items };
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
    return { items: [] };
  }
} 
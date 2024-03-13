import rehypeSanitize from "rehype-sanitize";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";

export default async function sanitize(dirty: string): Promise<string> {
    const file = await unified()
        .use(rehypeParse, { fragment: true })
        .use(rehypeSanitize)
        .use(rehypeStringify)
        .process(dirty);
    return file.toString();
}

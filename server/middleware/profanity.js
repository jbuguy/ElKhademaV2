import { Filter } from "bad-words";

const filter = new Filter();

export function profanityCheck(req, res, next) {
    const { content } = req.body;

    if (!content) {
        return next();
    }

    if (filter.isProfane(content)) {
        return res.status(400).json({
            error: "profanity detected",
        });
    }

    next();
}

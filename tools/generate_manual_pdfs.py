"""Generate user-facing PDF manuals from the maintained Markdown sources."""
from pathlib import Path
import re

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import (
    BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, PageBreak,
    KeepTogether, ListFlowable, ListItem, Table, TableStyle, Flowable,
)

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf"
SOURCES = [
    (ROOT / "docs" / "simulator-specification.md", OUTPUT / "CG303-Fault-Lab-Specification.pdf", "Specification"),
    (ROOT / "docs" / "operation-manual.md", OUTPUT / "CG303-Fault-Lab-Operation-Manual.pdf", "Operation Manual"),
]

navy = colors.HexColor("#102A43")
blue = colors.HexColor("#075EA8")
muted = colors.HexColor("#526D82")
light = colors.HexColor("#EAF5FF")
border = colors.HexColor("#D9E2EC")


def register_fonts():
    candidates = [
        ("C:/Windows/Fonts/arial.ttf", "C:/Windows/Fonts/arialbd.ttf"),
        ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
    ]
    for regular, bold in candidates:
        if Path(regular).exists() and Path(bold).exists():
            pdfmetrics.registerFont(TTFont("ManualSans", regular))
            pdfmetrics.registerFont(TTFont("ManualSans-Bold", bold))
            return "ManualSans", "ManualSans-Bold"
    return "Helvetica", "Helvetica-Bold"


FONT, FONT_BOLD = register_fonts()


class WorkflowDiagram(Flowable):
    """Portrait-friendly vector version of the simulator workflow SVG."""
    stages = [
        ("1", "BRIEF", "Review symptoms and records - form hypotheses", colors.HexColor("#075EA8")),
        ("2", "SAFETY", "Identify and isolate - prove, dead, re-prove", colors.HexColor("#27864A")),
        ("3", "TEST", "Select instruments - collect discriminating evidence", colors.HexColor("#D69E2E")),
        ("4", "DIAGNOSE", "Identify every supported fault - recommend action", colors.HexColor("#7C3AED")),
        ("5", "REPORT", "Review score and gaps - repeat or start a new scenario", navy),
    ]

    def __init__(self):
        super().__init__()
        self.height = 232

    def wrap(self, available_width, available_height):
        self.width = available_width
        return available_width, self.height

    def draw(self):
        canvas = self.canv
        canvas.saveState()
        canvas.setFillColor(colors.HexColor("#F4F8FB"))
        canvas.roundRect(0, 0, self.width, self.height, 10, fill=1, stroke=0)
        box_x, box_width, box_height, gap = 16, self.width - 32, 36, 8
        y = self.height - 48
        for index, (number, title, detail, accent) in enumerate(self.stages):
            if index:
                canvas.setStrokeColor(colors.HexColor("#829AB1")); canvas.setLineWidth(1.5)
                canvas.line(self.width/2, y+box_height+1, self.width/2, y+box_height+gap-1)
                canvas.setFillColor(colors.HexColor("#829AB1"))
                canvas.drawPath(_triangle(canvas, self.width/2, y+box_height+1), fill=1, stroke=0)
            canvas.setFillColor(colors.white); canvas.setStrokeColor(colors.HexColor("#9FB3C8")); canvas.setLineWidth(.7)
            canvas.roundRect(box_x, y, box_width, box_height, 7, fill=1, stroke=1)
            canvas.setFillColor(accent); canvas.circle(box_x+22, y+box_height/2, 11, fill=1, stroke=0)
            canvas.setFillColor(colors.white); canvas.setFont(FONT_BOLD, 9); canvas.drawCentredString(box_x+22, y+box_height/2-3, number)
            canvas.setFillColor(navy); canvas.setFont(FONT_BOLD, 9.5); canvas.drawString(box_x+43, y+22, title)
            canvas.setFillColor(muted); canvas.setFont(FONT, 8); canvas.drawString(box_x+43, y+9, detail)
            y -= box_height + gap
        canvas.restoreState()


def _triangle(canvas, x, y):
    path = canvas.beginPath(); path.moveTo(x-3, y+4); path.lineTo(x+3, y+4); path.lineTo(x, y); path.close()
    return path


def styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle("Title", fontName=FONT_BOLD, fontSize=25, leading=29, textColor=navy, spaceAfter=8),
        "subtitle": ParagraphStyle("Subtitle", fontName=FONT, fontSize=10, leading=15, textColor=muted, spaceAfter=18),
        "h1": ParagraphStyle("H1", fontName=FONT_BOLD, fontSize=16, leading=20, textColor=navy, spaceBefore=12, spaceAfter=7, keepWithNext=True),
        "h2": ParagraphStyle("H2", fontName=FONT_BOLD, fontSize=12, leading=16, textColor=blue, spaceBefore=8, spaceAfter=5, keepWithNext=True),
        "body": ParagraphStyle("Body", fontName=FONT, fontSize=9.4, leading=14, textColor=colors.HexColor("#17202A"), spaceAfter=7),
        "bullet": ParagraphStyle("Bullet", fontName=FONT, fontSize=9.2, leading=13.5, leftIndent=4, textColor=colors.HexColor("#17202A")),
        "code": ParagraphStyle("Code", fontName="Courier", fontSize=8.2, leading=11, leftIndent=8, rightIndent=8, borderColor=border, borderWidth=.5, borderPadding=7, backColor=colors.HexColor("#F4F6F8"), spaceAfter=8),
        "cover": ParagraphStyle("Cover", fontName=FONT_BOLD, fontSize=11, leading=16, textColor=blue, alignment=TA_CENTER),
    }


def inline(text):
    links = []
    def hold_link(match):
        links.append((match.group(1), match.group(2)))
        return f"@@MANUAL_LINK_{len(links)-1}@@"
    text = re.sub(r"\[([^\]]+)\]\((https?://[^)]+)\)", hold_link, text)
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"`(.+?)`", r"<font name='Courier'>\1</font>", text)
    for index, (label, url) in enumerate(links):
        text = text.replace(f"@@MANUAL_LINK_{index}@@", f'<link href="{url}" color="#075EA8"><u>{label}</u></link>')
    return text


def parse_markdown(path, label):
    st = styles()
    lines = path.read_text(encoding="utf-8").splitlines()
    title = lines[0].removeprefix("# ").replace("?", "-")
    meta, i = [], 1
    while i < len(lines) and not lines[i].startswith("## "):
        if lines[i].strip(): meta.append(lines[i].replace("  ", ""))
        i += 1
    story = [Spacer(1, 26*mm), Paragraph("CG303 FAULT LAB", st["cover"]), Spacer(1, 8*mm), Paragraph(inline(title), st["title"]), Paragraph("<br/>".join(inline(item) for item in meta), st["subtitle"])]
    story += [Table([["USER MANUAL", label.upper()]], colWidths=[42*mm, 90*mm], style=TableStyle([
        ("BACKGROUND", (0,0), (0,0), navy), ("TEXTCOLOR", (0,0), (0,0), colors.white),
        ("BACKGROUND", (1,0), (1,0), light), ("TEXTCOLOR", (1,0), (1,0), blue),
        ("FONTNAME", (0,0), (-1,-1), FONT_BOLD), ("FONTSIZE", (0,0), (-1,-1), 9),
        ("PADDING", (0,0), (-1,-1), 8), ("BOX", (0,0), (-1,-1), .5, border),
    ])), Spacer(1, 18*mm), Paragraph("Independent learning aid. No City & Guilds affiliation or endorsement is implied.", st["subtitle"]), PageBreak()]
    bullets, code = [], []

    def flush_bullets():
        nonlocal bullets
        if bullets:
            story.append(ListFlowable([ListItem(Paragraph(inline(x), st["bullet"])) for x in bullets], bulletType="bullet", leftIndent=16, bulletFontName=FONT, bulletFontSize=7, spaceAfter=7))
            bullets = []

    def flush_code():
        nonlocal code
        if code:
            story.append(Paragraph("<br/>".join(inline(x).replace(" ", "&nbsp;") for x in code), st["code"]))
            code = []

    in_code = False
    for line in lines[i:]:
        if line.startswith("```"):
            if in_code: flush_code()
            in_code = not in_code
            continue
        if in_code:
            code.append(line)
        elif line.startswith("## "):
            flush_bullets(); story.append(Paragraph(inline(line[3:].replace("?", "-")), st["h1"]))
        elif line.startswith("### "):
            flush_bullets(); story.append(Paragraph(inline(line[4:]), st["h2"]))
        elif line.startswith("- "):
            bullets.append(line[2:])
        elif re.match(r"^!\[[^\]]*\]\([^)]+simulator-workflow\.svg\)$", line):
            flush_bullets(); story.append(KeepTogether([Paragraph("Simulator workflow", st["h2"]), WorkflowDiagram(), Spacer(1, 8)]))
        elif re.match(r"^\d+\. ", line):
            flush_bullets(); story.append(Paragraph(inline(line), st["body"]))
        elif line.strip():
            flush_bullets(); story.append(Paragraph(inline(line.replace("?", "-")), st["body"]))
        else:
            flush_bullets()
    flush_bullets(); flush_code()
    return title, story


def draw_page(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setFillColor(navy); canvas.rect(0, height-12*mm, width, 12*mm, fill=1, stroke=0)
    canvas.setFillColor(colors.white); canvas.setFont(FONT_BOLD, 8); canvas.drawString(18*mm, height-7.5*mm, "CG303 FAULT LAB")
    canvas.setStrokeColor(border); canvas.line(18*mm, 13*mm, width-18*mm, 13*mm)
    canvas.setFillColor(muted); canvas.setFont(FONT, 7.5); canvas.drawString(18*mm, 8*mm, doc.short_title)
    canvas.drawRightString(width-18*mm, 8*mm, f"Page {doc.page}")
    canvas.restoreState()


def build(source, target, label):
    title, story = parse_markdown(source, label)
    doc = BaseDocTemplate(str(target), pagesize=A4, leftMargin=18*mm, rightMargin=18*mm, topMargin=20*mm, bottomMargin=18*mm, title=title, author="CG303 Fault Lab")
    doc.short_title = label
    doc.addPageTemplates(PageTemplate(id="Manual", frames=[Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="body")], onPage=draw_page))
    doc.build(story)


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for source, target, label in SOURCES:
        build(source, target, label)
        print(target.relative_to(ROOT))


if __name__ == "__main__":
    main()

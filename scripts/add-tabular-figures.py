"""Give a variable Libre Franklin woff2 tabular figures behind the `tnum` feature.

Upstream Libre Franklin 3.000 draws proportional digits only, so
`font-variant-numeric: tabular-nums` changes nothing and a ticking timer shifts.
This adds `zero.tf` … `nine.tf`: each is its digit's outline centred on the
advance of the widest digit, at every weight, and a GSUB `tnum` feature maps
the digits onto them.

The glyphs stay variable. Every digit varies over the same single `wght` region,
so a `.tf` glyph keeps its digit's point deltas, shifted by half the difference
between the widest digit's advance delta and its own, and takes the widest
digit's advance and HVAR entry.

    python -m pip install fonttools brotli
    python scripts/add-tabular-figures.py public/fonts/libre-franklin-latin.woff2

A file that has no digits, or already has `.tf` glyphs, is left untouched.
"""

import copy
import sys

from fontTools.ttLib import TTFont
from fontTools.ttLib.tables import otTables
from fontTools.ttLib.tables.TupleVariation import TupleVariation

DIGITS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
TABULAR_SUFFIX = ".tf"
FEATURE_TAG = "tnum"
VERSION_MARK = "; tabular figures added"
LEFT_PHANTOM, RIGHT_PHANTOM = -4, -3
BASE_GLYPH_CLASS = 1
VERSION_NAME_ID = 5


def tabular_name(digit):
    return digit + TABULAR_SUFFIX


def full_deltas(font, glyph_name, variation):
    coordinates, controls = font["glyf"]._getCoordinatesAndControls(glyph_name, font["hmtx"].metrics)
    complete = TupleVariation(dict(variation.axes), list(variation.coordinates))
    complete.calcInferredDeltas(coordinates, controls.endPts)
    return complete


def only_variation(font, glyph_name):
    variations = font["gvar"].variations.get(glyph_name, [])
    if len(variations) != 1:
        sys.exit(f"{glyph_name} has {len(variations)} variations; this script expects one wght region per digit")
    return full_deltas(font, glyph_name, variations[0])


def advance_delta(variation):
    return variation.coordinates[RIGHT_PHANTOM][0] - variation.coordinates[LEFT_PHANTOM][0]


def widest_digit(font):
    advances = font["hmtx"].metrics
    return max(DIGITS, key=lambda digit: advances[digit][0])


def add_tabular_glyph(font, digit, widest, widest_variation):
    glyf, hmtx = font["glyf"], font["hmtx"]
    name = tabular_name(digit)
    widest_advance = hmtx[widest][0]
    advance = hmtx[digit][0]
    static_shift = round((widest_advance - advance) / 2)

    source = glyf[digit]
    source.expand(glyf)
    glyph = copy.deepcopy(source)
    glyph.coordinates.translate((static_shift, 0))
    glyph.recalcBounds(glyf)

    glyf.glyphs[name] = glyph
    hmtx.metrics[name] = (widest_advance, glyph.xMin)

    variation = only_variation(font, digit)
    widest_delta = advance_delta(widest_variation)
    shift_delta = round((widest_delta - advance_delta(variation)) / 2)
    deltas = [(x + shift_delta, y) for x, y in variation.coordinates[:LEFT_PHANTOM]]
    left, _, top, bottom = variation.coordinates[LEFT_PHANTOM:]
    deltas += [left, (left[0] + widest_delta, left[1]), top, bottom]
    font["gvar"].variations[name] = [TupleVariation(dict(variation.axes), deltas)]

    hvar = font["HVAR"].table
    hvar.AdvWidthMap.mapping[name] = hvar.AdvWidthMap.mapping[widest]

    gdef = font["GDEF"].table
    gdef.GlyphClassDef.classDefs[name] = BASE_GLYPH_CLASS


def add_tnum_feature(font):
    gsub = font["GSUB"].table

    substitution = otTables.SingleSubst()
    substitution.Format = 2
    substitution.mapping = {digit: tabular_name(digit) for digit in DIGITS}
    lookup = otTables.Lookup()
    lookup.LookupType = 1
    lookup.LookupFlag = 0
    lookup.SubTable = [substitution]
    lookup.SubTableCount = 1
    gsub.LookupList.Lookup.append(lookup)
    gsub.LookupList.LookupCount = len(gsub.LookupList.Lookup)
    lookup_index = gsub.LookupList.LookupCount - 1

    feature = otTables.Feature()
    feature.FeatureParams = None
    feature.LookupListIndex = [lookup_index]
    feature.LookupCount = 1
    record = otTables.FeatureRecord()
    record.FeatureTag = FEATURE_TAG
    record.Feature = feature

    records = gsub.FeatureList.FeatureRecord
    insert_at = next((i for i, existing in enumerate(records) if existing.FeatureTag > FEATURE_TAG), len(records))
    records.insert(insert_at, record)
    gsub.FeatureList.FeatureCount = len(records)

    for script_record in gsub.ScriptList.ScriptRecord:
        script = script_record.Script
        language_systems = [script.DefaultLangSys] + [record.LangSys for record in script.LangSysRecord]
        for language_system in filter(None, language_systems):
            shifted = [index + 1 if index >= insert_at else index for index in language_system.FeatureIndex]
            language_system.FeatureIndex = sorted(shifted + [insert_at])
            language_system.FeatureCount = len(language_system.FeatureIndex)
            if language_system.ReqFeatureIndex != 0xFFFF and language_system.ReqFeatureIndex >= insert_at:
                language_system.ReqFeatureIndex += 1


def mark_modified(font):
    for record in font["name"].names:
        if record.nameID == VERSION_NAME_ID and VERSION_MARK not in record.toUnicode():
            record.string = record.toUnicode() + VERSION_MARK


def add_tabular_figures(path):
    font = TTFont(path)
    glyph_names = set(font.getGlyphOrder())
    if not set(DIGITS) <= glyph_names:
        print(f"{path}: no digits, left untouched")
        return
    if tabular_name(DIGITS[0]) in glyph_names:
        print(f"{path}: already has tabular figures, left untouched")
        return

    font.ensureDecompiled()
    font.setGlyphOrder(font.getGlyphOrder() + [tabular_name(digit) for digit in DIGITS])
    font["glyf"].glyphOrder = font.getGlyphOrder()

    widest = widest_digit(font)
    widest_variation = only_variation(font, widest)
    for digit in DIGITS:
        add_tabular_glyph(font, digit, widest, widest_variation)
    add_tnum_feature(font)
    mark_modified(font)

    font.save(path)
    print(f"{path}: {len(DIGITS)} tabular figures on the advance of {widest}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("usage: python scripts/add-tabular-figures.py <font.woff2>...")
    for font_path in sys.argv[1:]:
        add_tabular_figures(font_path)

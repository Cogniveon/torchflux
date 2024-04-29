from typing import Any

import pathlib

import anywidget
import traitlets


class TorchFluxDashboard(anywidget.AnyWidget):
    """Displays a counter button"""

    _esm = pathlib.Path(__file__).parent / "static" / "demoWidget.js"
    _css = pathlib.Path(__file__).parent / "static" / "style.css"
    value = traitlets.Int(0).tag(sync=True)

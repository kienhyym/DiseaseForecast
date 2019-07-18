import os
from .server import app


def run_app(host="103.74.120.54", port=9081, debug=False):
    """ Function for bootstrapping gatco app. """
    app.run(host=host, port=port, debug=debug, workers=1)

#!/usr/bin/python3 -OO
# -*- coding: utf-8 -*-

import os
import sys

from PyQt5.QtGui import QGuiApplication
from PyQt5.QtCore import QtMsgType, QMessageLogContext, QtDebugMsg, QtWarningMsg, QtCriticalMsg, \
    QtFatalMsg, qInstallMessageHandler

from view import MainView


def QtMsgHandler(msgType: QtMsgType, context: QMessageLogContext, msg: str):
    strType = {
        QtDebugMsg: "DEBUG",
        QtWarningMsg: "WARN",
        QtCriticalMsg: "CRITICAL",
        QtFatalMsg: "FATAL"
    }[msgType]
    print("Qt[{strType}] {category} {function} in {file}, on line {line}\n"
          " {msg}".format(strType = strType,
                          category = context.category,
                          function = context.function,
                          file = context.file,
                          line = context.line,
                          msg = msg),
          file = sys.stdout if msgType in (QtDebugMsg, QtWarningMsg) else sys.stderr)


class DManApp(QGuiApplication):
    def __init__(self, *args):
        super().__init__(*args)
        self.mainView = MainView()
        self.mainView.show()


if __name__ == "__main__":
    qInstallMessageHandler(QtMsgHandler)
    path = os.path.dirname(__file__)
    os.chdir(path)
    app = DManApp(sys.argv)
    sys.exit(app.exec())

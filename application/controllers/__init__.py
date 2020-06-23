from application.extensions import jinja


def init_controllers(app):
    import application.controllers.user_api
    import application.controllers.danhmuc_api
    import application.controllers.app_api
    import application.controllers.kehoach_api
    import application.controllers.notify
    import application.controllers.upload
    import application.controllers.forgot_password
    import application.controllers.sendmail
    import application.controllers.dmoss_upload_api

    @app.route('/')
    def index(request):
        return jinja.render('index.html', request)

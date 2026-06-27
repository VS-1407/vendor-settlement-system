class PaymentException(Exception):

    def __init__(self, message):
        self.message = message


class SettlementException(Exception):

    def __init__(self, message):
        self.message = message


class AuthorizationException(Exception):

    def __init__(self, message):
        self.message = message
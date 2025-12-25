using Twilio;
using Twilio.Rest.Api.V2010.Account;

public class SmsService
{
    private readonly IConfiguration _config;

    public SmsService(IConfiguration config)
    {
        _config = config;
    }

    public void SendSms(string toPhone, string message)
    {
        var accountSid = _config["Twilio:AccountSid"];
        var authToken = _config["Twilio:AuthToken"];
        var fromNumber = _config["Twilio:FromNumber"];

        TwilioClient.Init(accountSid, authToken);

        MessageResource.Create(
            body: message,
            from: new Twilio.Types.PhoneNumber(fromNumber),
            to: new Twilio.Types.PhoneNumber(toPhone)
        );
    }
}

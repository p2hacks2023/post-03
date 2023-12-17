from pybleno import *
import RPi.GPIO as GPIO
import threading
import dht11
import time
import datetime

bleno = Bleno()

SERVICE_UUID = '4c210b69-05e5-44e2-9ae2-c2b1a75df030'
FANCONTROL_CHARACTERISTIC_UUID = 'bde2f59b-4408-48dc-86bc-231841c8390b'
READ_TEMPERATURE_CHARACTERISTIC_ID = 'cf0cba4f-cf76-4286-aaca-a528923d075d'

fan_pin = 4
dht_pin = 14

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(fan_pin,GPIO.OUT)
GPIO.cleanup()
instance = dht11.DHT11(pin=dht_pin)

temperature = 23

def fan_on():
    GPIO.output(fan_pin,True)
    print("on")

def fan_off():
    GPIO.output(fan_pin,False)
    print("off")

def run_fun_impl(sec):
    fan_on()
    time.sleep(sec)
    fan_off()

def run_read_temperature():
    while True:
        result = instance.read()
        if result.is_valid():
            print("Last valid input: " + str(datetime.datetime.now()))
            print("Temperature: %d C" % result.temperature)
            temperature = result.temperature

        time.sleep(5)

def run_fan(sec):
    threading.Thread(target=run_fun_impl, args=(sec,)).start()

class ApproachCharacteristic(Characteristic):

    def __init__(self):
        Characteristic.__init__(self, {
            'uuid': FANCONTROL_CHARACTERISTIC_UUID,
            'properties': ['write'],
            'value': None
        })

        self._value = str(0).encode()
        self._updateValueCallback = None

    def onWriteRequest(self, data, offset, withoutResponse, callback):
        print('ApproachCharacteristic - onWriteRequest')
        received_value = int.from_bytes(data, byteorder='big');

        if received_value == 0 or received_value > 60:
            callback(self.RESULT_UNLIKELY_ERROR)
            return

        run_fan(received_value)

        callback(self.RESULT_UNLIKELY_ERROR)

class ReadTempertureCharacteristic(Characteristic):

    def __init__(self):
        Characteristic.__init__(self, {
            'uuid': READ_TEMPERATURE_CHARACTERISTIC_ID,
            'properties': ['read'],
            'value': None
        })

        self._value = str(0).encode()
        self._updateValueCallback = None

    def onReadRequest(self, offset, callback):
        print('ReadTempertureCharacteristic - onReadRequest')
        callback(result=Characteristic.RESULT_SUCCESS, data=bytes([temperature]))


def onStateChange(state):
    print('on -> stateChange: ' + state)

    if (state == 'poweredOn'):
        bleno.startAdvertising(name='futocool_cooling_device', service_uuids=[SERVICE_UUID])
    else:
        bleno.stopAdvertising()


bleno.on('stateChange', onStateChange)

approachCharacteristic = ApproachCharacteristic()
readTempertureCharacteristic = ReadTempertureCharacteristic()


def onAdvertisingStart(error):
    print('on -> advertisingStart: ' + ('error ' + error if error else 'success'))

    if not error:
        bleno.setServices([
            BlenoPrimaryService({
                'uuid': SERVICE_UUID,
                'characteristics': [
                    approachCharacteristic,
                    readTempertureCharacteristic
                ]
            })
        ])


bleno.on('advertisingStart', onAdvertisingStart)

bleno.start()

threading.Thread(target=run_read_temperature).start()

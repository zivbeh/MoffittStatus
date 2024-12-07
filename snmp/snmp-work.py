import asyncio
from pysnmp.hlapi.v1arch.asyncio import *
async def run(varBinds):
    snmpDispatcher = SnmpDispatcher()
    while True:
        iterator = await bulk_cmd(
            snmpDispatcher,
            CommunityData("private"),
            await UdpTransportTarget.create(("10.0.0.1", 161)),
            0,
            50,
            *varBinds
        )
        errorIndication, errorStatus, errorIndex, varBindTable = iterator
        if errorIndication:
            print(errorIndication)
            break
        elif errorStatus:
            print(
                "{} at {}".format(
                    errorStatus.prettyPrint(),
                    errorIndex and varBinds[int(errorIndex) - 1][0] or "?",
                )
            )
        else:
            with open("oo111o.txt", 'a') as f:
                for varBind in varBindTable:
                    f.write(" = ".join([x.prettyPrint() for x in varBind]))
                    f.write('\n')
        varBinds = varBindTable
        if is_end_of_mib(varBinds):
            break
    snmpDispatcher.transport_dispatcher.close_dispatcher()
asyncio.run(run([ObjectType(ObjectIdentity('.1.3.6.1.2.1.17.4.3.1.1'))]))
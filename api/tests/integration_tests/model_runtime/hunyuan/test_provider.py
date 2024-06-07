import os

import pytest
import pdb
from core.model_runtime.errors.validate import CredentialsValidateFailedError
from core.model_runtime.model_providers.hunyuan.hunyuan import HunyuanProvider


def test_validate_provider_credentials():
    
    
    provider = HunyuanProvider()

    with pytest.raises(CredentialsValidateFailedError):
        provider.validate_provider_credentials(
            credentials={}
        )

    provider.validate_provider_credentials(
        credentials={
           'tencent_Secret_Id': os.environ.get('HUNYUAN_TENCENT_SECRET_ID'),
            # 'tencent_Secret_Id':'AKIDDHQWYSeo1A7qcRBkAarqsprkU7cuYK7n',
            # 'tencent_Secret_Key':'3vZ0JOJ1ZyPvX5Wr393kDhy891mREuRq',
           'tencent_Secret_Key': os.environ.get('HUNYUAN_TENCENT_SECRET_KEY')
            # 'dashscope_api_key':'sk-24e52f58e8004d539d6e8fb5258ff92b'
        }
    )
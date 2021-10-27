import assert from 'assert';
import chai, { expect } from 'chai';
import { stub, restore } from 'sinon';
import sinonChai from 'sinon-chai';
import { authTokenService } from 'src/services/AuthToken';

import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MembershipGuard } from './membership.guard';

function contextFor(request: Record<string, unknown>): ExecutionContext {
  return {
    getHandler: () => function handler() {},
    getClass: () => class Controller {},
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

describe('MembershipGuard', () => {
  const organization = { id: 'org_1', slug: 'acme' };
  const execute = jest.fn();
  let guard: MembershipGuard;

  beforeEach(() => {
    execute.mockReset();
    execute.mockResolvedValue({ organization });
    guard = new MembershipGuard(new Reflector(), { execute } as never);
  });

  it('denies a request without a user', async () => {
    const request = { params: { orgSlug: 'acme' }, query: {} };
    await expect(guard.canActivate(contextFor(request))).resolves.toBe(false);
    expect(execute).not.toHaveBeenCalled();
  });

  it('denies by default when the route names no organization', async () => {
    const request = { user: { id: 'user_1' }, params: {}, query: {} };
    await expect(guard.canActivate(contextFor(request))).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(execute).not.toHaveBeenCalled();
  });

  it('checks the membership and exposes the organization', async () => {
    const request: Record<string, unknown> = {
      user: { id: 'user_1' },
      params: { orgSlug: 'acme' },
      query: {},
    };
    await expect(guard.canActivate(contextFor(request))).resolves.toBe(true);
    expect(execute).toHaveBeenCalledWith('user_1', 'acme', undefined);
    expect(request.organization).toBe(organization);
  });
});
